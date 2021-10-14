import Usuario from '../Models/Usuario';
import Token from '../Models/Token';
import Turno from '../Models/Turno';
import Vehiculo from '../Models/Vehiculo';
import { Agenda } from 'agenda/es';
import config from '../config';
const database_url = config.DATABASE_URL;
import { emailAceptarCompania, emailRestablecerContraseña, emailCambioContraseña } from '../email';
import { notificarTurno } from '../Libs/cronJobs';
import { socketSend, companyUpdate } from '../index';
import { v4 } from 'uuid';
import DataCrons from '../Models/DataCrons';

const agenda = new Agenda({ db: { address: database_url, options: { useUnifiedTopology: true } } });



export const getUserData = async (req, res) => {
    try {
        // return res.json(req.userData)
        return res.json({
            perfil: {
                nombre: req.userData.nombre,
                apellido: req.userData.apellido,
                email: req.userData.email, 
                rol: req.userData.rol
            },
            sesionesActivas: req.userData.refreshTokens.length,
            vehiculo:{
                patente: req.userData.vehiculoActual.id?.patente,
                marca: req.userData.vehiculoActual.id?.marca,
                modelo: req.userData.vehiculoActual.id?.modelo,
                kilometraje: req.userData.vehiculoActual.id?.kmactual,
                alertas: req.alertas,
                tareas: req.tareas
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const codigoConductor = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'No se ha especificado un email para recibir el codigo' });
    try {
        const newToken = new Token({
            companyId: req.companyId,
            rol: "conductor",
            tipo: 'registro',
            email,
            gestorData: {
                id: req.userId,
                email: req.userData.email
            }
        })

        const nuevoToken = await newToken.save();
        emailAceptarCompania({
            destino: email,
            token: nuevoToken._id,
            gestor: req.userData
        })
        res.json({ codigo: nuevoToken._id, message: "Email enviado con exito!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const codigoGestor = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'No se ha especificado un email para recibir el codigo' });
    try {
        const newToken = new Token({
            companyId: req.companyId,
            rol: "gestor",
            tipo: 'registro',
            email
        })
        const nuevoToken = await newToken.save();
        emailAceptarCompania({
            destino: email,
            token: nuevoToken._id,
            gestor: req.userData
        })
        res.json({ codigo: nuevoToken._id, message: "Email enviado con exito!" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const crearTurno = async (req, res) => {
    try {
        const companyId = req.companyId;
        const { codigoDeTurno, fechaYhora, nombreVendedor, codigoOrdenDeCompra } = req.body;
        if (!nombreVendedor || !codigoOrdenDeCompra) return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos' });
        const nuevoTurno = new Turno({
            codigoDeTurno,
            fechaYhora: fechaYhora.toLocaleString(),
            nombreVendedor,
            codigoOrdenDeCompra,
            companyId,
            condicion: "No asignado"
        });
        const turnoNuevo = await nuevoTurno.save();
        companyUpdate(req.companyId)
        return res.status(200).json({
            turno: turnoNuevo,
            message: 'Turno creado con exito'
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const asignarTurno = async (req, res) => {
    try {
        const turno = req.turno;
        if(turno.condicion == "Asignado") return res.status(400).json({ message: "Este turno ya esta asignado" })
        await Promise.all([
            Usuario.findByIdAndUpdate(req.conductor._id, { $push: { turnosPendientes: { id: turno._id, fechaAsignado: new Date() } } }, { new: true }),
            Turno.findByIdAndUpdate(turno._id, {condicion: "Asignado" })
        ])
        let fecha = turno.fechaYhora;
        fecha.setDate( fecha.getDate() - 2 );
        let fechaUsada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 9, 0, 0);
        notificarTurno({
            fecha: fechaUsada,
            destino: req.conductor.email
        });
        companyUpdate(req.companyId)
        const nuevoCron = new DataCrons({
            fecha: fechaUsada,
            destino: req.conductor.email
        });
        const cronNuevo = await nuevoCron.save();
        return res.json({ message: 'Turno asignado con exito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const restablecerContaseña = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) { return res.status(400).json({ message: 'No se ha especificado un email para recibir el codigo' }) }
        const userDB = await Usuario.findOne({ email });
        if (!userDB) { return res.json({ message: 'Sigue las instrucciones en el email que vas a recibir. Fijate que hayas escrito bien tu dirección! El codigo expira en 30 minutos.' }) }
        await Token.findOneAndRemove({ email, tipo: 'contraseña' }); //Limpia el token anterior
        const tokenRestablecer = new Token({
            tipo: 'contraseña',
            email,
            secret: v4().split('-').join('') + v4().split('-').join(''),
            expires: Date.now() + 1000 * 60 * 30
        })
        const tokenRes = await tokenRestablecer.save();
        emailRestablecerContraseña({
            destino: email,
            token: tokenRes.secret
        });
        return res.json({ token: tokenRes.secret, message: 'Sigue las instrucciones en el email que vas a recibir. Fijate que hayas escrito bien tu dirección! El codigo expira en 30 minutos.' })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const cambiarContraseñaPorToken = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) { return res.status(400).json({ message: "Faltan 1 o mas campos requeridos" }) }
        const tkn = await Token.findOne({ secret: token });
        if (!tkn) { return res.status(400).json({ message: "Token invalido, probablemente haya expirado" }) }
        if (tkn.expires > Date.now()) {
            const user = await Usuario.findOne({ email: tkn.email }).select("+password")
            if (await Usuario.verificarPassword(password, user.password)) { return res.status(400).json({ message: "Las contraseñas no pueden ser iguales" }) }
            const passwordEncriptada = await Usuario.encriptarPassword(password);
            await Promise.all([
                Usuario.findByIdAndUpdate(user._id, {
                    password: passwordEncriptada,
                    refreshTokens: []
                }),
                Token.findByIdAndDelete(tkn._id)
            ])
            emailCambioContraseña({
                destino: tkn.email
            });
            return res.json({message: "Contraseña cambiada con exito!" });
        } else {
            await Token.findByIdAndDelete(tkn._id)
            return res.status(400).json({ message: "Token invalido, probablemente haya expirado" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const cambiarContraseñaLogueado = async (req, res) => {
    try {
        const {password, passwordActual} = req.body;
        if (!password || !passwordActual) {return res.status(400).json({ message: "Faltan 1 o mas campos requeridos" })}
        if (password.length <= 6){return res.status(400).json({ message: "La contraseña debe ser mayor a 6 caracteres" })}
        if (!await Usuario.verificarPassword(passwordActual, req.userData.password)) { return res.status(400).json({ message: "Contraseña actual incorrecta" }) }
        if (await Usuario.verificarPassword(password, req.userData.password)) { return res.status(400).json({ message: "La contraseña nueva no puede ser igual a la anterior" }) }
        await Promise.all([
            Usuario.findByIdAndUpdate(req.userId, {
                password: await Usuario.encriptarPassword(password),
                refreshTokens: []
            })
        ])
        emailCambioContraseña({
            destino: req.userData.email
        });
        return res.json({message: "Contraseña cambiada con exito! Por seguridad tendra que volver a iniciar sesión"})

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const editarUsuario = async (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        if(!nombre || !apellido ) return res.status(400).json({ message: "Faltan 1 o mas campos requeridos"})
        const nuevosDatos = await Usuario.findByIdAndUpdate(req.userData._id, {nombre, apellido});
        return res.status(200).json({ message: "Datos cambiados con exito!" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const empezarEntrega = async (req, res) => {
    try {
        const {codigoDeTurno} = req.body;
        if(!codigoDeTurno) return res.status(400).json({ message: "Hay un campo vacio"})
        const turno = await Turno.findOne({codigoDeTurno});
        if(!turno) return res.status(400).json({ message: "No se encontro ningun turno con ese codigo"})
        if(req.userData?.turnoActual?.id) return res.status(400).json({ message: "Ya estas en una entrega"})
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.userId, { turnoActual: { id: turno._id }, $pull:{ turnosPendientes: { id: turno._id } } }, { new: true });
        const msg = req.userData.nombre + " " + req.userData.apellido + " ha comenzado la entrega del turno " + req.body.codigoDeTurno;
        socketSend(req.companyId, "entrega", msg, "empiezaEntrega");
        return res.status(200).json({ message: "Entrega empezada con exito"})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const terminarEntrega = async (req, res) => {
    try {
        if(!req.userData?.turnoActual?.id) return res.status(400).json({ message: "No estas en ninguna entrega"});
        const turno = await Turno.findById(req.userData.turnoActual.id);
        if(turno.condicion == "Terminado") return res.status(400).json({ message: "Este turno ya esta terminado" })
        await Promise.all([
            await Usuario.findByIdAndUpdate(req.userId, { turnoActual: null, $push:{ turnosPasados: { id: turno._id} } }, { new: true }),
            await Turno.findByIdAndUpdate(turno._id, {condicion: "Terminado"})
        ])
        const msg = req.userData.nombre + " " + req.userData.apellido + " ha finalizado la entrega del turno " + turno.codigoDeTurno;
        socketSend(req.companyId, "entrega", msg, "terminaEntrega");
        return res.status(200).json({ message: "Entrega terminada con exito" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}