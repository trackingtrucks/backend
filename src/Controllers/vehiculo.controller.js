import Usuario from '../Models/Usuario';
import Vehiculo from '../Models/Vehiculo';
import { alertSend, socketSend } from '../index.js';
import { v4 } from 'uuid'
import mongoose from 'mongoose'
export const crear = async (req, res) => {
    try {
        const { marca, modelo, año, kmactual } = req.body;
        let { patente } = req.body;
        const companyId = req.userData.companyId;
        patente = formatPatente(patente);
        const patenteFormato = getFormato(patente);
        //Regex de año
        if (!patente || !marca || !modelo || !año || !kmactual) { return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos' }) }
        const nuevoVehiculo = new Vehiculo({
            patente,
            patenteFormato,
            companyId,
            marca,
            modelo,
            año,
            kmactual,
            notaGestor: ""
        });
        const vehiculoEnDB = await nuevoVehiculo.save();
        //Guardar el documento
        res.json({ vehiculo: vehiculoEnDB, success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const asignarConductor = async (req, res) => {
    try {
        if (req.userData.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo al que te estás tratando de asignar no es de tu misma compania' })
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha subido al vehiculo " + req.body.patente.toUpperCase();
        socketSend(req.userData.companyId, "notificacion", msg);
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { conductorActual: { id: req.userId, fechaDesde: new Date() } }, { new: true }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: req.vehiculoId, fechaDesde: new Date() } }, { new: true })
        ]).then(([vehiculoActualizado])=> {
        return res.json({ message: "Asignado con éxito!", marca: vehiculoActualizado.marca, modelo: vehiculoActualizado.modelo, kilometraje: vehiculoActualizado.kmactual })
    })
        // return res.json({vehiculoEditado, usuarioEditado})
        // return res.json({ message: "Asignado con éxito!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const desasignarConductor = async (req, res) => {
    try {
        if (req.userData.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo del que te estás tratando de desasignar no es de tu misma compania' })
        const kilometrajeActual = req.body?.kilometrajeActual;
        if (!kilometrajeActual) return res.status(400).json({ message: 'No se llenó el campo del kilometraje actual' });
        const vehiculoActual = req.vehiculoData;
        const conductorActual = req.userData;
        if (kilometrajeActual < vehiculoActual.kmactual) { return res.status(400).json({ message: "El kilometraje nuevo no puede ser menor al anterior" }) }
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha bajado del vehiculo " + vehiculoActual.patente.toUpperCase();
        socketSend(req.userData.companyId, "notificacion", msg);
        let jsonRes = { message: "Desasignado con éxito!", alerta: false, alertas: [] };
        for (let i = 0; i < vehiculoActual?.tareas?.length; i++) {
            const tarea = vehiculoActual.tareas[i];
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada) {
                //Alerta Urgente
                const sePasoPor = kilometrajeActual - (tarea.cantidadUltima + tarea.cantidadCada);
                const alerta = `El vehiculo ha excedido el limite para el cambio de ${tarea.tipo} por ${sePasoPor}kms`
                alertSend(req.userData.companyId, "alto", tarea.tipo, alerta, req.vehiculoId)
                jsonRes.alerta = true;
                jsonRes.alertas.push(alerta);
                await Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $push: {
                        alertas: [{ tipo: tarea.tipo, nivel: "alto", cantidad: sePasoPor, quePasa: "sobra", _id: v4().toString() }]
                    }
                }, { new: true })
                continue; 
            }
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada - tarea.avisarAntes) {
                //Alerta Media
                const leFaltan = (tarea.cantidadUltima + tarea.cantidadCada) - kilometrajeActual;
                const alerta = `El vehiculo se está acercando al limite para el cambio de ${tarea.tipo} por ${leFaltan}kms`
                jsonRes.alerta = true;
                jsonRes.alertas.push(alerta);
                alertSend(req.userData.companyId, "medio", tarea.tipo, alerta, req.vehiculoId)
                await Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $push: {
                        alertas: [{ tipo: tarea.tipo, nivel: "medio", cantidad: leFaltan, quePasa: "falta", _id: v4().toString() }]
                    }
                }, { new: true })
            }
        }
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { kmactual: kilometrajeActual, conductorActual: { id: null, fechaDesde: null }, $push: { conductoresPasados: { id: req.userId, fechaDesde: vehiculoActual.conductorActual.fechaDesde, fechaHasta: new Date() } } }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: null, fechaDesde: null }, $push: { vehiculosPasados: { id: req.vehiculoId, fechaDesde: conductorActual.vehiculoActual.fechaDesde, fechaHasta: new Date() } } })
        ])
        return res.json(jsonRes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const eliminarAlertas = async (req, res) => {
    try {
        const { id } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        if (!id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const vehiculoEnDB = await Vehiculo.findById(id).select("alertas").select("companyId");
        if (!vehiculoEnDB) return res.status(404).json({ message: 'No se encontró un vehiculo' })
        if (vehiculoEnDB.companyId !== req.userData.companyId) { return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa." }) }
        await Vehiculo.findByIdAndUpdate(id, {
            alertas: []
        })
        res.json({message: "Alertas eliminadas con exito!"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const eliminarAlertaById = async (req, res) => {
    try {
        const { id, alerta } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        if (!id || !alerta) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const vehiculoEnDB = await Vehiculo.findById(id).select("alertas").select("companyId");
        if (!vehiculoEnDB) return res.status(404).json({ message: 'No se encontró un vehiculo' })
        if (vehiculoEnDB.companyId !== req.userData.companyId) { return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa." }) }
        const arrayNuevo = vehiculoEnDB.alertas.filter((alert) => alert._id !== alerta);
        const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(id, {
            alertas: arrayNuevo
        }, {new: true})
        return res.json({vehiculoActualizado})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const formatPatente = (patente) => {
    return patente.split(' ').join('').split('-').join('').trim().toUpperCase();
}
function getFormato(patente) {
    if (patente.length === 6) {
        return 1;
    }
    if (patente.length === 7) {
        return 2;
    }
    //1 o 2
    //1: AAA000
    //2: AA 000 AA
}