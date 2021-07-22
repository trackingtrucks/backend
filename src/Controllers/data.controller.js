import DatosOBD2 from "../Models/DatosOBD2";
import Vehiculo from '../Models/Vehiculo';

export const subirDatosOBD = async (req, res) => {
    try {
        const { fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes, kilometrosRecorridos } = req.body;
        const vehiculo = await Vehiculo.findById(req.userData.vehiculoActual.id);
        if (!vehiculo) return res.status(400).json({ message: 'No está asignado a ningun vehiculo' })
        const nuevosDatosOBD = new DatosOBD2({ vehiculo: { id: vehiculo._id }, fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes, kilometrosRecorridos });
        const datos = coolantTemperature.split(',')
        return res.json({ data: nuevosDatosOBD, datos })
        // const newData = await nuevosDatosOBD.save();
        return res.status(200).json({ message: 'Datos subidos con exito' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const subirDatosOBD2 = async (req, res) => {
    try {
        const { coolantTemperature } = req.body;
        const datos = JSON.parse(coolantTemperature.replace(/'/g, `"`))
        const valores = Object.keys(datos).map(function (i) { return datos[i]; });
        Object.keys(datos).forEach((fecha) => {
            var timestamp = Date.parse(fecha);
            renameKey(datos, fecha, timestamp)
        })
        const promedio = sacarPromedio({ valores })
        return res.json({ datos });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



function sacarPromedio({ valores }) {
    let total = 0;
    valores.forEach(dato => {
        dato = parseInt(dato, 10)
        total += dato;
    });
    return parseFloat((total / valores.length).toFixed(2))
}
function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}