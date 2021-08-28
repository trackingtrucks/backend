import Usuario from '../Models/Usuario';
import Vehiculo from '../Models/Vehiculo';
import Alerta from '../Models/Alerta';
import { alertSend, socketSend } from '../index.js';
import { v4 } from 'uuid'
import mongoose from 'mongoose'
export const crear = async (req, res) => {
    try {
        const { marca, modelo, año, kmactual } = req.body;
        let { patente } = req.body;
        const companyId = req.companyId;
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
export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID Invalida" })
        const vehiculoEnDB = await Vehiculo.findOne({ _id: id, companyId: req.companyId }).select("companyId")
        if (!vehiculoEnDB || vehiculoEnDB.companyId !== req.companyId) return res.status(404).json({ message: "No se ha encontrado el vehiculo" })
        await Vehiculo.findByIdAndDelete(id)
        return res.json({ message: "Vehiculo eliminado con exito!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const asignarConductor = async (req, res) => {
    try {
        if (req.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo al que te estás tratando de asignar no es de tu misma compania' })
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha subido al vehiculo " + req.body.patente.toUpperCase();
        socketSend(req.companyId, "notificacion", msg);
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { conductorActual: { id: req.userId, fechaDesde: new Date() } }, { new: true }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: req.vehiculoId, fechaDesde: new Date(), patente: req.vehiculoData.patente } }, { new: true })
        ]).then(([vehiculoActualizado]) => {
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
        if (req.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo del que te estás tratando de desasignar no es de tu misma compania' })
        const {kilometrajeActual} = req.body;
        if (!kilometrajeActual) return res.status(400).json({ message: 'No se llenó el campo del kilometraje actual' });
        const vehiculoActual = req.vehiculoData;
        const conductorActual = req.userData;
        if (kilometrajeActual < vehiculoActual.kmactual) { return res.status(400).json({ message: "El kilometraje nuevo no puede ser menor al anterior" }) }
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha bajado del vehiculo " + vehiculoActual.patente.toUpperCase();
        socketSend(req.companyId, "notificacion", msg);
        let jsonRes = { message: "Desasignado con éxito!", alerta: false, alertas: [] };
        for (let i = 0; i < vehiculoActual?.tareas?.length; i++) { //recorriendo las tareas del vehiculo.
            const tarea = vehiculoActual.tareas[i];
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada) {
                //Alerta Urgente
                let existe = false;
                const sePasoPor = kilometrajeActual - (tarea.cantidadUltima + tarea.cantidadCada);
                const alertaMsg = `El vehiculo ha excedido el limite para el cambio de ${tarea.tipo} por ${sePasoPor}kms`
                alertSend(req.companyId, "alto", tarea.tipo, alertaMsg, req.vehiculoId)
                jsonRes.alerta = true;
                jsonRes.alertas.push(alertaMsg);
                for (var j = 0; j < vehiculoActual.alertas.length; j++) {
                    const alerta = vehiculoActual.alertas[j];
                    if (alerta.tipo == tarea.tipo) {
                        existe = true;
                        console.log(alerta._id);
                        await Alerta.findByIdAndUpdate(alerta._id, {
                            cantidad: sePasoPor,
                            nivel: "alto",
                            quePasa: "sobra"
                        })
                        break;
                    }
                }
                if (existe) continue;
                const nuevaAlerta = new Alerta({
                    tipo: tarea.tipo, nivel: "alto", cantidad: sePasoPor, quePasa: "sobra", companyId: req.companyId, vehiculo: req.vehiculoId
                })
                Promise.all([
                    Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                        $push: {
                            alertas: [nuevaAlerta._id]
                        }
                    }, { new: true }),
                    nuevaAlerta.save()
                ])
                continue;
            }
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada - tarea.avisarAntes) {
                //Alerta Media
                let existe = false;
                const leFaltan = (tarea.cantidadUltima + tarea.cantidadCada) - kilometrajeActual;
                const alerta = `El vehiculo se está acercando al limite para el cambio de ${tarea.tipo} por ${leFaltan}kms`
                alertSend(req.companyId, "medio", tarea.tipo, alerta, req.vehiculoId)
                jsonRes.alerta = true;
                jsonRes.alertas.push(alerta);
                for (var j = 0; j < vehiculoActual.alertas.length; j++) {
                    const alerta = vehiculoActual.alertas[j];
                    if (alerta.tipo == tarea.tipo) {
                        existe = true;
                        console.log(alerta._id);
                        await Alerta.findByIdAndUpdate(alerta._id, {
                            cantidad: leFaltan,
                            nivel: "medio",
                            quePasa: "falta"
                        })
                        break;
                    }
                }
                if (existe) continue;
                const nuevaAlerta = new Alerta({
                    tipo: tarea.tipo, nivel: "medio", cantidad: leFaltan, quePasa: "falta", companyId: req.companyId, vehiculo: req.vehiculoId
                })
                Promise.all([
                    Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                        $push: {
                            alertas: [nuevaAlerta._id]
                        }
                    }, { new: true }),
                    nuevaAlerta.save()
                ])
            }
        }
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { kmactual: kilometrajeActual, conductorActual: { id: null, fechaDesde: null }, $push: { conductoresPasados: { id: req.userId, fechaDesde: vehiculoActual.conductorActual.fechaDesde, fechaHasta: new Date() } } }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: null, fechaDesde: null, patente: null }, $push: { vehiculosPasados: { id: req.vehiculoId, fechaDesde: conductorActual.vehiculoActual.fechaDesde, fechaHasta: new Date(), patente: conductorActual.vehiculoActual.patente } } })
        ])
        return res.json(jsonRes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const desasignarConductor2 = async (req, res) => {
    try {
        if (req.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo del que te estás tratando de desasignar no es de tu misma compania' })
        const kilometrajeActual = req.body?.kilometrajeActual;
        if (!kilometrajeActual) return res.status(400).json({ message: 'No se llenó el campo del kilometraje actual' });
        const vehiculoActual = req.vehiculoData;
        const conductorActual = req.userData;
        if (kilometrajeActual < vehiculoActual.kmactual) { return res.status(400).json({ message: "El kilometraje nuevo no puede ser menor al anterior" }) }
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha bajado del vehiculo " + vehiculoActual.patente.toUpperCase();
        socketSend(req.companyId, "notificacion", msg);
        let jsonRes = { message: "Desasignado con éxito!", alerta: false, alertas: [] };
        for (let i = 0; i < vehiculoActual?.tareas?.length; i++) { //recorriendo las tareas del vehiculo.
            const tarea = vehiculoActual.tareas[i];
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada) {
                //Alerta Urgente
                const sePasoPor = kilometrajeActual - (tarea.cantidadUltima + tarea.cantidadCada);
                const alerta = `El vehiculo ha excedido el limite para el cambio de ${tarea.tipo} por ${sePasoPor}kms`
                alertSend(req.companyId, "alto", tarea.tipo, alerta, req.vehiculoId)
                jsonRes.alerta = true;
                jsonRes.alertas.push(alerta);
                await Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $pull: {
                        alertas: { tipo: tarea.tipo }
                    },
                    $push: {
                        alertas: { tipo: tarea.tipo, nivel: "alto", cantidad: sePasoPor, quePasa: "sobra", _id: v4().toString() }
                    }
                }, { new: true, multi: true })
                continue;
            }
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada - tarea.avisarAntes) {
                //Alerta Media
                const leFaltan = (tarea.cantidadUltima + tarea.cantidadCada) - kilometrajeActual;
                const alerta = `El vehiculo se está acercando al limite para el cambio de ${tarea.tipo} por ${leFaltan}kms`
                jsonRes.alerta = true;
                jsonRes.alertas.push(alerta);
                alertSend(req.companyId, "medio", tarea.tipo, alerta, req.vehiculoId)
                await Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $pull: {
                        alertas: { tipo: tarea.tipo }
                    },
                    $push: {
                        alertas: { tipo: tarea.tipo, nivel: "medio", cantidad: leFaltan, quePasa: "falta", _id: v4().toString() }
                    }
                }, { new: true, multi: true })
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
        if (vehiculoEnDB.companyId !== req.companyId) { return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa." }) }
        await Alerta.deleteMany({ vehiculo: id })
        res.json({ message: "Alertas eliminadas con exito!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const eliminarAlertaById = async (req, res) => {
    try {
        const { id } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        if (!id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const alertaEnDB = await Alerta.findById(id);
        if (!alertaEnDB) return res.status(404).json({ message: 'No se encontró una alerta' })
        if (alertaEnDB.companyId !== req.companyId) { return res.status(401).json({ message: "La alerta que estas solicitando no se encuentra en su empresa." }) }
        Promise.all([
            Alerta.findByIdAndDelete(id),
            Vehiculo.findByIdAndUpdate(alertaEnDB.vehiculo, {
                $pull: {
                    alertas: id
                }
            })
        ])
        res.json({ message: "Alerta eliminadas con exito!" })
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