import DatosOBD2 from "../Models/DatosOBD2";
import Vehiculo from '../Models/Vehiculo';

export const subirDatosOBD = async (req, res) => {
    try {
        const { fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes } = req.body;
        const idVehiculo = req.userData.vehiculoActual.id;
        const vehiculo = await Vehiculo.findOne(idVehiculo);
        if(!vehiculo) return res.status(400).json({ message: 'No está asignado a ningun vehiculo'})
        const nuevosDatosOBD = new DatosOBD2({ vehiculo: {id : vehiculo._id}, fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes });
        const datosNuevos = await nuevosDatosOBD.save();
        return res.status(200).json({ message: 'Datos subidos con exito' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}