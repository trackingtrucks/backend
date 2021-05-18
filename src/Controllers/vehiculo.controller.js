import Usuario from '../Models/Usuario';
import Vehiculo from '../Models/Vehiculo';

export const crear = async (req, res) => {
    try {
        const { marca, modelo, año } = req.body;
        let { patente } = req.body;
        const companyId = req.userData.companyId;
        patente = formatPatente(patente);
        const patenteFormato = getFormato(patente);
        //Regex de año
        if (!patente || !marca || !modelo || !año) { return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos' }) }
        const nuevoVehiculo = new Vehiculo({
            patente,
            patenteFormato,
            companyId,
            marca,
            modelo,
            año,
            notaGestor: ""
        });
        const vehiculoEnDB = await nuevoVehiculo.save();
        //Guardar el documento
        res.json({ vehiculoEnDB, success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
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