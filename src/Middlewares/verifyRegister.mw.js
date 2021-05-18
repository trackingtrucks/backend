import { ROLES } from '../Models/Role'
import Usuario from '../Models/Usuario'
import Vehiculo from '../Models/Vehiculo';
import { formatPatente } from '../Controllers/vehiculo.controller'
export const Roles = async (req, res, next) => {
    const roles = req.body.roles
    if (roles) {
        for (let i = 0; i < roles.length; i++) {
            if (!ROLES.includes(roles[i])) {
                return res.status(400).json({
                    message: `El rol ${roles[i]} no existe.`
                })
            }
        }
    }
    next();
}

export const existeUsuarioOEmail = async (req, res, next) => {
    const email = await Usuario.findOne({ email: req.body.email })
    if (email) return res.status(400).json({ message: 'Email ya existe' })
    next();
}

export const existePatenteRegistrada = async (req, res, next) => {
    const patente = await Vehiculo.findOne({ patente: formatPatente(req.body.patente) })
    if (patente) return res.status(400).json({ message: 'Patente ya registrada' })
    next();
}

export const usuarioYaAsignado = async (req, res, next) => {
    const {patente} = req.body
    if(!patente) return res.status(400).json({ message: 'Patente no especificada'})
    const usuario = await Vehiculo.findOne({"conductorActual.id": req.userId})
    const vehiculo = req.userData?.vehiculoActual?.id;
    if(vehiculo || usuario) return res.status(400).json({ message: 'Este usuario esta asignado a otro vehiculo'})
    console.log('usuario no asignado')
    next();
}

export const vehiculoYaAsignado = async (req, res, next) => {
    const patente = req.body?.patente;
    const vehiculo = await Vehiculo.findOne({patente: formatPatente(patente)})
    if(!vehiculo) return res.status(400).json({ message: 'No se encontraron vehiculos con esa patente'})
    if(vehiculo?.conductorActual?.id) return res.status(400).json({ message: 'Este vehiculo esta asignado a otro usuario'})
    req.vehiculoData = vehiculo;
    req.vehiculoId = vehiculo._id;
    console.log('vehiculo no asignado')
    next();
}