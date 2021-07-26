import Usuario from '../Models/Usuario';
import Vehiculo from '../Models/Vehiculo';
import socketSend, { alertSend } from '../index.js';
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
        ])
        // return res.json({vehiculoEditado, usuarioEditado})
        return res.json({ message: "Asignado con éxito!" })
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
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha bajado del vehiculo " + req.body.patente.toUpperCase();
        socketSend(req.userData.companyId, "notificacion", msg);
        let jsonRes = { message: "Desasignado con éxito!", alerta: false };
        console.log(req.vehiculoId);
        vehiculoActual.tareas && vehiculoActual.tareas.forEach(async (tarea) => {
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada) {
                //Alerta Urgente
                const sePasoPor = kilometrajeActual - (tarea.cantidadUltima + tarea.cantidadCada);
                const alerta = `El vehiculo ha excedido el limite para el cambio de ${tarea.tipo} por ${sePasoPor}kms`
                alertSend(req.userData.companyId, "alto", tarea.tipo, alerta, req.vehiculoId)
                jsonRes.alerta = true;
                jsonRes.alertaMsg = alerta;
                Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $push: {
                        alertas: [{ tipo: tarea.tipo, nivel: "alto", cantidad: sePasoPor, quePasa: "sobra" }]
                    }
                })

                return; //VER SI CON MAS DE UNA TAREA SE SALTA TODO O SOLO 1
            }
            if (kilometrajeActual >= tarea.cantidadUltima + tarea.cantidadCada - tarea.avisarAntes) {
                //Alerta Media
                const leFaltan = (tarea.cantidadUltima + tarea.cantidadCada) - kilometrajeActual;
                const alerta = `El vehiculo se está acercando al limite para el cambio de ${tarea.tipo} por ${leFaltan}kms`
                jsonRes.alerta = true;
                jsonRes.alertaMsg = alerta;
                alertSend(req.userData.companyId, "medio", tarea.tipo, alerta, req.vehiculoId)
                await Vehiculo.findByIdAndUpdate(req.vehiculoId, {
                    $push: {
                        alertas: [{ tipo: tarea.tipo, nivel: "medio", cantidad: leFaltan, quePasa: "falta" }]
                    }
                })
            }
        })
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { kmactual: kilometrajeActual, conductorActual: { id: null, fechaDesde: null }, $push: { conductoresPasados: { id: req.userId, fechaDesde: vehiculoActual.conductorActual.fechaDesde, fechaHasta: new Date() } } }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: null, fechaDesde: null }, $push: { vehiculosPasados: { id: req.vehiculoId, fechaDesde: conductorActual.vehiculoActual.fechaDesde, fechaHasta: new Date() } } })
        ])
        return res.json(jsonRes)
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