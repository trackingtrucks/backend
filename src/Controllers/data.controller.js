import DatosOBD2 from "../Models/DatosOBD2";
import Vehiculo from '../Models/Vehiculo';
import Data from '../Models/Data';

export const subirDatosOBD = async (req, res) => {
    try {
        const { fuelLevel, RPM, speed, coolantTemperature, pendingTroubleCodes, kilometrosRecorridos } = req.body;
        const vehiculo = await Vehiculo.findById(req.userData.vehiculoActual.id);
        if (!vehiculo) return res.status(400).json({ message: 'No está asignado a ningun vehiculo' })
        const nuevosDatosOBD = new DatosOBD2({ vehiculo: { id: vehiculo._id }, fuelLevel, RPM, speed, coolantTemperature, kilometrosRecorridos, companyId: req.companyId, pendingTroubleCodes });
        // const newData = await nuevosDatosOBD.save();
        console.log(nuevosDatosOBD);
        res.json({message: "Datos guardados!", datos: nuevosDatosOBD, vehiculo: vehiculo._id});

        const valores = ["fuelLevel", "RPM", "speed", "coolantTemperature"];
        let datosProcesados = { fuelLevel: {}, RPM: {}, speed: {}, coolantTemperature: {} };
        valores.forEach((valor) => {
            datosProcesados[valor] = procesar({ datos: req.body[valor] })
        })
        const DataProcesada = new Data({
            vehiculo: vehiculo._id,
            data: datosProcesados,
            companyId: req.companyId
        })
        await DataProcesada.save();
        console.log("Procesado!");
        // console.log(datosProcesados);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const testProcesado = async (req, res) => {
    try {
        const valores = ["fuelLevel", "RPM", "speed", "coolantTemperature"];
        let state = { fuelLevel: {}, RPM: {}, speed: {}, coolantTemperature: {} };
        valores.forEach((valor) => {
            if (!req.body[valor]) { throw new Error(`No se envio el valor '${valor}'`) }
            state[valor] = procesar({ datos: req.body[valor] })
        })
        res.json(state)
    } catch (error) {
        return res.status(500).json({ message: "Error al procesar los datos: " + error.message })
    }

}

function procesar({ datos, chart = [] }) {
    const keys = Object.keys(datos).map(function (i) { return i; });
    const valores = Object.keys(datos).map(function (i) { return datos[i]; });
    // for (var i in datos) {
    //     chart.push({ x: parseInt(i, 10), y: datos[i] });
    // }
    return {
        ultimoValor: datos[keys[keys.length - 1]],
        promedio: sacarPromedio({ valores }),
        datos,
        // chart,
        timestamps: {
            desde: keys[0],
            hasta: keys[keys.length - 1]
        }
    }
}

export const sample = async (req, res) => {
    try {
        const coolantTemperature = "{'Mon Jul 19 2021 11:55:23 GMT-0300 (-03)':'24C','Mon Jul 19 2021 11:55:30 GMT-0300 (-03)':'45C','Mon Jul 19 2021 11:55:37 GMT-0300 (-03)':'61C','Mon Jul 19 2021 11:55:44 GMT-0300 (-03)':'61C','Mon Jul 19 2021 11:55:51 GMT-0300 (-03)':'62C','Mon Jul 19 2021 11:55:58 GMT-0300 (-03)':'62C','Mon Jul 19 2021 11:56:05 GMT-0300 (-03)':'63C','Mon Jul 19 2021 11:56:11 GMT-0300 (-03)':'64C','Mon Jul 19 2021 11:56:19 GMT-0300 (-03)':'64C','Mon Jul 19 2021 11:56:26 GMT-0300 (-03)':'64C','Mon Jul 19 2021 11:56:32 GMT-0300 (-03)':'65C','Mon Jul 19 2021 11:56:39 GMT-0300 (-03)':'66C','Mon Jul 19 2021 11:56:40 GMT-0300 (-03)':'66C','Mon Jul 19 2021 11:56:46 GMT-0300 (-03)':'66C','Mon Jul 19 2021 11:56:47 GMT-0300 (-03)':'66C','Mon Jul 19 2021 11:56:53 GMT-0300 (-03)':'66C','Mon Jul 19 2021 11:57:00 GMT-0300 (-03)':'68C','Mon Jul 19 2021 11:57:07 GMT-0300 (-03)':'69C','Mon Jul 19 2021 11:57:13 GMT-0300 (-03)':'69C','Mon Jul 19 2021 11:57:20 GMT-0300 (-03)':'69C','Mon Jul 19 2021 11:57:27 GMT-0300 (-03)':'70C','Mon Jul 19 2021 11:57:33 GMT-0300 (-03)':'69C','Mon Jul 19 2021 11:57:34 GMT-0300 (-03)':'70C','Mon Jul 19 2021 11:57:40 GMT-0300 (-03)':'71C','Mon Jul 19 2021 11:57:48 GMT-0300 (-03)':'71C','Mon Jul 19 2021 11:57:54 GMT-0300 (-03)':'72C','Mon Jul 19 2021 11:58:01 GMT-0300 (-03)':'72C','Mon Jul 19 2021 11:58:08 GMT-0300 (-03)':'72C','Mon Jul 19 2021 11:58:15 GMT-0300 (-03)':'73C','Mon Jul 19 2021 11:58:22 GMT-0300 (-03)':'73C','Mon Jul 19 2021 11:58:29 GMT-0300 (-03)':'74C','Mon Jul 19 2021 11:58:36 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:58:43 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:58:50 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:58:56 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:59:03 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:59:10 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:59:16 GMT-0300 (-03)':'75C','Mon Jul 19 2021 11:59:23 GMT-0300 (-03)':'77C','Mon Jul 19 2021 11:59:30 GMT-0300 (-03)':'78C','Mon Jul 19 2021 11:59:31 GMT-0300 (-03)':'78C','Mon Jul 19 2021 11:59:37 GMT-0300 (-03)':'79C','Mon Jul 19 2021 11:59:38 GMT-0300 (-03)':'78C','Mon Jul 19 2021 11:59:44 GMT-0300 (-03)':'78C','Mon Jul 19 2021 11:59:52 GMT-0300 (-03)':'78C','Mon Jul 19 2021 11:59:59 GMT-0300 (-03)':'78C','Mon Jul 19 2021 12:00:05 GMT-0300 (-03)':'78C','Mon Jul 19 2021 12:00:12 GMT-0300 (-03)':'78C','Mon Jul 19 2021 12:00:18 GMT-0300 (-03)':'78C','Mon Jul 19 2021 12:00:25 GMT-0300 (-03)':'78C','Mon Jul 19 2021 12:00:32 GMT-0300 (-03)':'79C','Tue Jul 20 2021 18:35:52 GMT-0300 (-03)':'24C','Tue Jul 20 2021 18:35:58 GMT-0300 (-03)':'26C','Tue Jul 20 2021 18:36:05 GMT-0300 (-03)':'27C','Tue Jul 20 2021 18:36:11 GMT-0300 (-03)':'28C','Tue Jul 20 2021 18:36:17 GMT-0300 (-03)':'29C','Tue Jul 20 2021 18:36:23 GMT-0300 (-03)':'30C','Tue Jul 20 2021 18:36:30 GMT-0300 (-03)':'30C','Tue Jul 20 2021 18:36:37 GMT-0300 (-03)':'31C','Tue Jul 20 2021 18:36:43 GMT-0300 (-03)':'32C','Tue Jul 20 2021 18:36:49 GMT-0300 (-03)':'33C','Tue Jul 20 2021 18:36:55 GMT-0300 (-03)':'33C'}"
        let coolant = { datos: {}, promedio: 0, chart: [] };
        coolant.datos = JSON.parse(coolantTemperature.replace(/'/g, `"`))
        coolant = procesarOld({ datos: coolant.datos })
        return res.json({ coolant })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


function procesarOld({ datos, chart = [] }) {
    const valores = Object.keys(datos).map(function (i) { return datos[i]; });
    Object.keys(datos).forEach((fecha, i) => {
        const timestamp = Date.parse(fecha);
        renameKey(datos, fecha, timestamp);
    })
    for (var i in datos) {
        chart.push({ x: parseInt(i, 10), y: datos[i] });
    }

    return {
        promedio: sacarPromedio({ valores }),
        datos,
        chart
    }
}

function sacarPromedio({ valores, total = 0 }) {
    valores.forEach(dato => {
        dato = parseInt(dato, 10);
        total += dato;
    });
    return parseFloat((total / valores.length).toFixed(2))
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = parseInt(obj[oldKey], 10);
    // obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}