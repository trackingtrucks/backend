import DatosOBD2 from "../Models/DatosOBD2";
import Vehiculo from '../Models/Vehiculo';

export const subirDatosOBD = async (req, res) => {
    try {
        const { fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes, kilometrosRecorridos } = req.body;
        console.log(req.body);
        if(!speed) return res.status(400).json({message: 'No se recibio la speed'});
        const _id = req.userData.vehiculoActual.id;
        const vehiculo = await Vehiculo.findById({ _id });
        if(!vehiculo) return res.status(400).json({ message: 'No está asignado a ningun vehiculo'})
        const nuevosDatosOBD = new DatosOBD2({ vehiculo: {id : vehiculo._id}, fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes, kilometrosRecorridos });
        await nuevosDatosOBD.save();
        return res.status(200).json({ message: 'Datos subidos con exito' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}