import Vehiculo from '../Models/Vehiculo';
import config from '../config';
import Usuario from '../Models/Usuario'
/*
############
# ACCIONES #
############
*/

export const getAllData = async (req, res) => {
    try {
        const companyId = req.userData.companyId // Agarra la id de la compania pedida.
        if (!companyId) return res.status(400).json({ message: 'No se especificó una ID' })   //Chequea que se haya mandado una companyid en al request (seria bastante raro ya que la persona en si esta registrada)
        //ESTO SE PUDE OPTIMIZAR MAS, HACER UNA SOLA REQUEST Y PARSEAR
        let gestores = [];
        let conductores = [];
        const usuarios = await Usuario.find({ companyId }, { password: 0, refreshTokens: 0 });      // Hace el requests pidiendo solo los gestores
        await usuarios.forEach(element => {
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
        const vehiculos = await Vehiculo.find({ companyId })
        if (gestores.length === 0 && conductores.length === 0) return res.status(404).json({ message: "No se encontraron usuarios en esa companía" }); // Chequea si hay resultados en la busqueda
        return res.json({ gestores, conductores, vehiculos });

    } catch (error) {
        res.status(500).json({ message: error.message }) //devulve si hay algun error
    }
}

export const getUserByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) {return res.status(400).json({ message: 'No se especificó una ID' })}
        const userEnDb = await Usuario.findById(req.body.id, { password: 0, refreshTokens: 0 } );
        if (!userEnDb) return res.status(404).json({ message: 'No se encontró un usuario' })
        if (userEnDb.companyId !== req.userData.companyId){return res.status(401).json({ message: "El usuario que estas solicitando no se encuentra en su empresa."})}
        return res.json({usuario: userEnDb})
    } catch (error) {
        res.status(404).json({ message: 'No se encontro un usuario' }) //devulve si hay algun error
    }
}

export const getVehiculoByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) {return res.status(400).json({ message: 'No se especificó una ID' })}
        const vehiculoEnDB = await Vehiculo.findById(req.body.id);
        if (!vehiculoEnDB) return res.status(404).json({ message: 'No se encontró un vehiculo' })
        if (vehiculoEnDB.companyId !== req.userData.companyId){return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa."})}
        return res.json({vehiculo: vehiculoEnDB})
    } catch (error) {
        res.status(404).json({ message: 'No se encontró un vehiculo' }) //devulve si hay algun error
    }
}


/*
#############
# FUNCIONES #
#############
*/