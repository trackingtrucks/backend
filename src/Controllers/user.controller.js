import Usuario from '../Models/Usuario';
import Token from '../Models/Token';
import Turno from '../Models/Turno';
import Vehiculo from '../Models/Vehiculo';
import { Agenda } from 'agenda/es';
import config from '../config';
const database_url = config.DATABASE_URL;
import {emailAceptarCompania} from '../email';
import { sendMessage } from '../index';
const agenda = new Agenda({ db: { address: database_url, options: {useUnifiedTopology: true} } });

export const codigoConductor = async (req, res) => {
    const {email} = req.body;
    if (!email) return res.status(400).json({ message: 'No se ha especificado un email para recibir el codigo'});
    try {
        const newToken = new Token({
            companyId: req.userData.companyId,
            rol: "conductor",
            gestorData: {
                id: req.userId,
                email: req.userData.email
            }
        })
        
        const nuevoToken = await newToken.save();
        await emailAceptarCompania({
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
    const {email} = req.body;
    if (!email) return res.status(400).json({ message: 'No se ha especificado un email para recibir el codigo'});
    try {
        const newToken = new Token({
            companyId: req.userData.companyId,
            rol: "gestor"
        })
        const nuevoToken = await newToken.save();
        await emailAceptarCompania({
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
        const companyId = req.userData.companyId;
        const { codigoDeTurno,  fechaYhora, nombreVendedor, codigoOrdenDeCompra} = req.body;
        if(!nombreVendedor || !codigoOrdenDeCompra) return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos'});
        const nuevoTurno = new Turno({
            codigoDeTurno,
            fechaYhora: fechaYhora.toLocaleString(),
            nombreVendedor,
            codigoOrdenDeCompra,
            companyId
        });
        const turnoNuevo = await nuevoTurno.save();
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
        await Promise.all([
            Usuario.findByIdAndUpdate(req.conductor._id, { $push: { turnosPendientes: { id: turno._id, fechaAsignado: new Date() } } }, { new: true }),
            Turno.findByIdAndDelete(turno._id)
        ])
        /*var fecha = turno.fechaYhora;
        fecha.setDate( fecha.getDate() - 2 );
        var fechaUsada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 9, 0, 0);*/
        //agenda.define("mandar notificacion", async (job) => {
        //})                    ***ARREGLAR***
        //await agenda.start();
        //await agenda.schedule("in 5 minutes", "mandar notificacion");
        return res.json({ message: 'Turno asignado con exito'});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}