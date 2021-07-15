import Usuario from '../Models/Usuario';
import Vehiculo from '../Models/Vehiculo';
import socketSend from '../index.js';
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
    try{
        if(req.userData.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo al que te estás tratando de asignar no es de tu misma compania'})
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
    try{
        if(req.userData.companyId !== req.vehiculoData.companyId) return res.status(400).json({ message: 'El vehiculo del que te estás tratando de desasignar no es de tu misma compania'})
        const msg = req.userData.nombre + " " + req.userData.apellido + " se ha bajado del vehiculo " + req.body.patente.toUpperCase();
        socketSend(req.userData.companyId, "notificacion", msg);
        const kilometrajeActual = req.body?.kilometrajeActual;
        if(!kilometrajeActual) return res.status(400).json({ message: 'No se llenó el campo del kilometraje actual'});
        const vehiculoActual = req.vehiculoData
        const conductorActual = req.userData;
        await Promise.all([
            Vehiculo.findByIdAndUpdate(req.vehiculoId, { kmactual: kilometrajeActual, conductorActual: { id: null, fechaDesde: null }, $push: { conductoresPasados: { id: req.userId, fechaDesde: vehiculoActual.conductorActual.fechaDesde, fechaHasta: new Date() } } }, { new: true }),
            Usuario.findByIdAndUpdate(req.userId, { vehiculoActual: { id: null, fechaDesde: null }, $push: { vehiculosPasados: { id: req.vehiculoId, fechaDesde: conductorActual.vehiculoActual.fechaDesde, fechaHasta: new Date() } } }, { new: true })
        ])
        return res.json({ message: "Desasignado con éxito!" })
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