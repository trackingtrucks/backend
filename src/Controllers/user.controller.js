import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import Token from '../Models/Token'
// import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
// import config from '../config'
// const secret = config.SECRET;

export const eliminar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) return res.status(404).json("No se encontraron usuarios con esa ID");
    await Usuario.findByIdAndRemove(req.body.id);
    res.json({ message: 'Usuario eliminado con éxito!' })
}

export const getByCompanyId = async (req, res) => {
    try {
        const companyId = req.userData.companyId // Agarra la id de la compania pedida.
            if (!companyId) return res.status(400).json({ message: 'No se especificó una ID' })   //Chequea que se haya mandado una companyid en al request (seria bastante raro ya que la persona en si esta registrada)
        const gestorRole = await Role.findOne({ nombre: 'gestor' });        //Setea los roles de gestor
        const conductorRole = await Role.findOne({ nombre: 'conductor' });  //y de conductor.
        const gestores = await Usuario.find({ companyId, roles: gestorRole._id });      // Hace el requests pidiendo solo los gestores
        const conductores = await Usuario.find({ companyId, roles: conductorRole._id });// Hace el requests pidiendo solo los conductores
            if (gestores.length === 0 && conductores.length === 0) return res.status(404).json({ message: "No se encontraron usuarios en esa companía" }); // Chequea si hay resultados en la busqueda
                return res.json({ gestores, conductores });                                     // Devuelve los 2 objetos

    } catch (error) {
        res.status(500).json({ message: error.message }) //devulve si hay algun error
    }
}

export const getAll = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const returnData = async (req, res) => {
    res.json(req.userData)
}

export const codigoGestor = async (req, res) => {
    try {
        const {companyId} = req.body
        if (!companyId) return res.status(404).json({message: 'No se especificó ninguna compania'})
        const newToken = new Token({
            companyId,
            rol: "gestor"
        })
        const nuevoToken = await newToken.save()
        res.json({codigo: nuevoToken._id}) //ver de enviar por mail una url
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

export const codigoCheck  = async (req, res) => {
    try {
        const {codigo} = req.body
        if (!codigo) return res.status(404).json({message: 'No se especificó ningun codigo'})
        const response = await Token.findById(codigo)
        if (!response) return res.status(401).json({valid: false})
        res.json({valid: true})
    } catch (error) {
        res.status(500).json({ message: error.message, valid: false }) 
    }
}