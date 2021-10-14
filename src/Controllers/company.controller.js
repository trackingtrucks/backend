import Vehiculo from '../Models/Vehiculo';
import config from '../config';
import Usuario from '../Models/Usuario';
import Formulario from '../Models/Formulario';
import Tarea from '../Models/Tarea';
import Turno from '../Models/Turno';
import Alerta from '../Models/Alerta';
import Compania from '../Models/Compania';
import DatosOBD2 from '../Models/DataRaw';
import DataCrons from '../Models/DataCrons';
import Tramite from '../Models/Tramite';
import Data from '../Models/Data';
import { notificarTramite, notificarTramitePronto } from '../Libs/cronJobs';
import mongoose from 'mongoose';
import { emailEnvioFormulario } from '../email';
import { companyUpdate } from '../index'
/*
############
# ACCIONES #
############
*/

export const getAllData = async (req, res) => {
    try {
        const companyId = req.companyId // Agarra la id de la compania pedida.
        if (!companyId) return res.status(400).json({ message: 'No se especificó una ID' })   //Chequea que se haya mandado una companyid en al request (seria bastante raro ya que la persona en si esta registrada)    
        Promise.all([
            Vehiculo.find({ companyId }).populate("tareas").populate("alertas").select("-companyId"),
            Turno.find({ companyId }),
            Usuario.find({ companyId }).select("+agregadoPor"),
            Tarea.find({ companyId }),
            Alerta.find({ companyId }),
            // DatosOBD2.find({ companyId }),
            Data.find({ companyId }),
            Compania.findOne({ companyId }).select("-_id"),
        ]).then(([vehiculos, turnos, usuarios, tareas, alertas, datosProcesados, company]) => {
            let gestores = [];
            let conductores = [];
            usuarios.forEach(element => {
                switch (element.rol) {
                    case "gestor":
                        gestores.push(element)
                        break;
                    case "conductor":
                        conductores.push(element)
                        break;
                    default:
                        break;
                }
            });
            vehiculos.forEach((vehiculo) => {
                vehiculo.datos = datosProcesados.filter(dato => dato.vehiculo.equals(vehiculo._id))
            })
            if (gestores.length === 0 && conductores.length === 0) return res.status(404).json({ message: "No se encontraron usuarios en esa companía" }); // Chequea si hay resultados en la busqueda
            return res.json({ company, gestores, conductores, vehiculos, turnos, tareas, alertas, datos: datosProcesados });
        })

    } catch (error) {
        res.status(500).json({ message: error.message }) //devulve si hay algun error
    }
}


export const crearTramite = async (req, res) => {
    try {
        const { date, vehiculo, titulo, descripcion, ultimavez: ultimaVez, urgencia } = req.body;
        if (!date || !vehiculo || !titulo) { return res.status(400).json({ message: "Faltan 1 o mas campos requeridos" }) }
        if (!mongoose.Types.ObjectId.isValid(vehiculo)) return res.status(404).json({ message: "ID Invalida" });

        const newTramite = new Tramite({
            date,
            vehiculo,
            titulo,
            descripcion,
            ultimaVez,
            urgencia,
            companyId: req.companyId
        })
        const cronTramite = new DataCrons({
            fecha: date,
            destino: req.userData.email,
            tipo: "tramite",
            tramite: newTramite._id
        })

        notificarTramite({
            fecha: date,
            destino: req.userData.email,
            tituloTramite: titulo,
            vehiculo,
            companyId: req.companyId
        })
        date.setDate(date.getDate() - 7);
        notificarTramitePronto({
            fecha: date,
            tituloTramite: titulo,
            vehiculo,
            companyId: req.companyId
        })
        await Promise.all([
            cronTramite.save(),
            newTramite.save()
        ]).then(([cron, tramite]) => {
            return res.json({ cron, tramite })
        })
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const crearTarea = async (req, res) => {
    try {
        const { vehiculo, tipo, cantidadCada, cantidadUltima, avisarAntes } = req.body;
        if (!vehiculo || !tipo || !cantidadCada || !cantidadUltima) { return res.status(400).json({ message: 'Faltan 1 o mas campos necesarios' }) }
        const vehiculoEnDB = await Vehiculo.findById(vehiculo);
        if (!vehiculoEnDB || vehiculoEnDB.companyId !== req.companyId) { return res.status(400).json({ message: 'Vehiculo no encontrado' }) }
        if (cantidadUltima > vehiculoEnDB.kmactual) return res.status(400).json({ message: `La ultima vez que se realizo la tarea no puede ser menor a ${vehiculoEnDB.kmactual}kms` })
        if (cantidadCada < avisarAntes) return res.status(400).json({ message: "El aviso no puede ser mayor a la cantidad de cuando se realiza la tarea" })
        const nuevaTarea = new Tarea({
            vehiculo,
            tipo,
            cantidadCada,
            cantidadUltima,
            avisarAntes,
            companyId: req.companyId
        })
        await Promise.all([
            nuevaTarea.save(),
            Vehiculo.findByIdAndUpdate(vehiculo, { $push: { tareas: [nuevaTarea._id] } }, { new: true })
        ])
        companyUpdate(req.companyId)
        res.json({ nuevaTarea, message: "Tarea creada con exito!" })
    } catch (error) {
        const msg = error.errors['tipo'].message ? error?.errors['tipo']?.message : error.message
        res.status(400).json({ message: msg }) //devulve si hay algun error
    }
}

export const editarTarea = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        if (!id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const tareaEnDB = await Tarea.findById(id).select("+companyId");
        if (!tareaEnDB) return res.status(404).json({ message: 'No se encontró una tarea' })
        const { cantidadCada = tareaEnDB.cantidadCada, cantidadUltima = tareaEnDB.cantidadUltima, avisarAntes = tareaEnDB.avisarAntes } = req.body.data; // pongo valores default
        if (tareaEnDB.companyId !== req.companyId) { return res.status(401).json({ message: "La tarea que estas solicitando no se encuentra en su empresa." }) }
        const tareaActualizada = await Tarea.findByIdAndUpdate(id, {
            cantidadCada,
            cantidadUltima,
            avisarAntes
        }, {
            new: true
        })
        companyUpdate(req.companyId)
        return res.json(tareaActualizada)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTareaById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        if (!id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const tareaEnDB = await Tarea.findById(id).select("+companyId");
        if (!tareaEnDB) return res.status(404).json({ message: 'No se encontraron tareas con esa ID' })
        if (tareaEnDB.companyId !== req.companyId) { return res.status(401).json({ message: "La tarea que estas solicitando no se encuentra en su empresa." }) }
        res.json(tareaEnDB)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTareasByVehiculo = async (req, res) => {
    try {
        const { vehiculo } = req.body;
        if (!mongoose.Types.ObjectId.isValid(vehiculo)) return res.status(404).json({ message: "ID Invalida" });
        if (!vehiculo) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const tareas = await Tarea.find({ vehiculo: vehiculo, companyId: req.companyId }).select("+companyId")
        if (!tareas) return res.status(404).json({ message: 'No se encontraron tareas asignadas para ese vehiculo' })
        res.json(tareas)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const userEnDb = await Usuario.findById(req.body.id).select("+agregadoPor");
        if (!userEnDb) return res.status(404).json({ message: 'No se encontró un usuario' })
        if (userEnDb.companyId !== req.companyId) { return res.status(401).json({ message: "El usuario que estas solicitando no se encuentra en su empresa." }) }
        return res.json({ usuario: userEnDb })
    } catch (error) {
        res.status(404).json({ message: 'No se encontro un usuario' }) //devulve si hay algun error
    }
}

export const getVehiculoByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const vehiculoEnDB = await Vehiculo.findById(req.body.id).populate("tareas");
        if (!vehiculoEnDB) return res.status(404).json({ message: 'No se encontró un vehiculo' })
        if (vehiculoEnDB.companyId !== req.companyId) { return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa." }) }
        return res.json({ vehiculo: vehiculoEnDB })
    } catch (error) {
        res.status(404).json({ message: 'No se encontró un vehiculo' }) //devulve si hay algun error
    }
}

export const nuevoForm = async (req, res) => {
    try {
        const { nombreEmpresa, email, descripcionUso, genteCompania } = req.body;
        if (!nombreEmpresa || !email || !descripcionUso || !genteCompania) { return res.status(400).json({ message: 'Faltan 1 o mas campos necesarios' }) }
        const form = new Formulario({
            nombreEmpresa,
            email,
            descripcionUso,
            genteCompania
        })
        const formEnDB = await form.save();
        emailEnvioFormulario({
            destino: email
        })
        return res.json({ message: "Gracias por comunicarse con nosotros, estaremos en contacto con usted", form: formEnDB })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCurrentUserData = async (req, res) => {
    try {
        const turnosPendientes = req.userData.turnosPendientes;
        const turnoActual = await Turno.findById(req.userData.turnoActual.id);
        let turnos = [];
        for (const turno of turnosPendientes) {
            const turnoCompleto = await Turno.findById(turno.id);
            turnos.push(turnoCompleto)
        }
        return res.json({ turnosPendientes: turnos, turnoActual: turnoActual });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateAlertas = async (req, res) => {
    try {
        const a = req.company.alertas
        const { alertaMedia = a.alertaMedia, alertaAlta = a.alertaAlta, subirAuto = a.subirAuto, bajarAuto = a.bajarAuto, empiezaEntrega = a.empiezaEntrega, terminaEntrega = a.terminaEntrega, notificacionTramite = a.notificacionTramite } = req.body
        const updatedCompany = await Compania.findOneAndUpdate({ companyId: req.companyId }, {
            alertas: {
                alertaMedia,
                alertaAlta,
                subirAuto,
                bajarAuto,
                empiezaEntrega,
                terminaEntrega,
                notificacionTramite
            }
        }, { new: true })
        res.json(updatedCompany)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
/*
#############
# FUNCIONES #
#############
*/