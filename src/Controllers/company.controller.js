import Vehiculo from '../Models/Vehiculo';
import config from '../config';
import Usuario from '../Models/Usuario';
import Formulario from '../Models/Formulario';
import Tarea from '../Models/Tarea';
import Turno from '../Models/Turno';
import {emailEnvioFormulario} from '../email';
/*
############
# ACCIONES #
############
*/

export const getAllData = async (req, res) => {
    try {
        const companyId = req.userData.companyId // Agarra la id de la compania pedida.
        if (!companyId) return res.status(400).json({ message: 'No se especificó una ID' })   //Chequea que se haya mandado una companyid en al request (seria bastante raro ya que la persona en si esta registrada)    
        Promise.all([
            Vehiculo.find({ companyId }).populate("tareas"),
            Turno.find({ companyId }),
            Usuario.find({ companyId }).select("+agregadoPor"),
            Tarea.find({companyId})
        ]).then(([vehiculos, turnos, usuarios, tareas]) => {
            let gestores = [];
            let conductores = [];
            usuarios.forEach(element => {
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
            if (gestores.length === 0 && conductores.length === 0) return res.status(404).json({ message: "No se encontraron usuarios en esa companía" }); // Chequea si hay resultados en la busqueda
            return res.json({ gestores, conductores, vehiculos, turnos, tareas });
        })

    } catch (error) {
        res.status(500).json({ message: error.message }) //devulve si hay algun error
    }
}

export const crearTarea = async (req, res) => {
    try {
        const { vehiculo, tipo, cantidadCada, cantidadUltima, avisarAntes } = req.body;
        if (!vehiculo || !tipo || !cantidadCada || !cantidadUltima) { return res.status(400).json({ message: 'Faltan 1 o mas campos necesarios' }) }
        const vehiculoEnDB = await Vehiculo.findById(vehiculo);
        if (!vehiculoEnDB || vehiculoEnDB.companyId !== req.userData.companyId) { return res.status(400).json({ message: 'Vehiculo no encontrado' }) }
        const nuevaTarea = new Tarea({
            vehiculo,
            tipo,
            cantidadCada,
            cantidadUltima,
            avisarAntes,
            companyId: req.userData.companyId
        })
        await Promise.all([
            nuevaTarea.save(),
            Vehiculo.findByIdAndUpdate(vehiculo, { $push: { tareas: [nuevaTarea._id] } }, { new: true })
        ])
        res.json({ nuevaTarea })
    } catch (error) {
        const msg = error.errors['tipo'].message ? error?.errors['tipo']?.message : error.message
        res.status(400).json({ message: msg }) //devulve si hay algun error
    }
}

export const getUserByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const userEnDb = await Usuario.findById(req.body.id).select("+agregadoPor");
        if (!userEnDb) return res.status(404).json({ message: 'No se encontró un usuario' })
        if (userEnDb.companyId !== req.userData.companyId) { return res.status(401).json({ message: "El usuario que estas solicitando no se encuentra en su empresa." }) }
        return res.json({ usuario: userEnDb })
    } catch (error) {
        res.status(404).json({ message: 'No se encontro un usuario' }) //devulve si hay algun error
    }
}

export const getVehiculoByIdInsideCompany = async (req, res) => {
    try {
        if (!req.body.id) { return res.status(400).json({ message: 'No se especificó una ID' }) }
        const vehiculoEnDB = await Vehiculo.findById(req.body.id).populate("tareas");
        if (!vehiculoEnDB) return res.status(404).json({ message: 'No se encontró un vehiculo' })
        if (vehiculoEnDB.companyId !== req.userData.companyId) { return res.status(401).json({ message: "El vehiculo que estas solicitando no se encuentra en su empresa." }) }
        return res.json({ vehiculo: vehiculoEnDB })
    } catch (error) {
        res.status(404).json({ message: 'No se encontró un vehiculo' }) //devulve si hay algun error
    }
}

export const nuevoForm = async (req, res) => {
    try {
        const {nombreEmpresa, email, descripcionUso, genteCompania} = req.body;
        if (!nombreEmpresa || !email || !descripcionUso || !genteCompania){ return res.status(400).json({ message: 'Faltan 1 o mas campos necesarios' }) }
        const form = new Formulario({
            nombreEmpresa,
            email,
            descripcionUso, 
            genteCompania
        })
        const formEnDB = await form.save();
        emailEnvioFormulario({
            destino: email
        })
        return res.json({message: "Gracias por comunicarse con nosotros, estaremos en contacto con usted", form: formEnDB})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
/*
#############
# FUNCIONES #
#############
*/