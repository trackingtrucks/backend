import config from '../config';
import Vehiculo from '../Models/Vehiculo';
import Usuario from '../Models/Usuario';
import Formulario from '../Models/Formulario';
import Tarea from '../Models/Tarea';
import Turno from '../Models/Turno';
import Token from '../Models/Token';
import mongoose from 'mongoose';
import {emailAceptarFormulario} from '../email'

export const registrar = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        if (!nombre || !email || !password) return res.status(401).json({ message: "Faltan 1 o mas campos requeridos" })
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email: email.toLowerCase(),
            companyId: 'admins',
            rol: 'admin',
            password: await Usuario.encriptarPassword(password)
        })
        const refreshToken = generateRefreshToken(nuevoUsuario._id)
        nuevoUsuario.refreshTokens = [refreshToken]
        const userNuevo = await nuevoUsuario.save();
        res.status(200).json({
            userNuevo,
            accessToken: generateAccessToken(nuevoUsuario._id, refreshToken),
            refreshToken
        }) //envio como respuesta el access token, que va a durar 24hs, y el refresh token, que dura 7 dias.
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getForms = async (req, res) => {
    const forms = await Formulario.find();
    res.json({forms});
}

export const aceptarForm = async (req, res) => {
    try {
        const { companyId, id } = req.body;
        if (!companyId || !id) return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: "ID Invalida"});
        const formData = await Formulario.findById(id);
        if (!formData) return res.status(404).json({ message: 'ID de formulario de registro no encontrado'});
        const newToken = new Token({
            companyId,
            rol: "gestor"
        });
        await Promise.all([
            newToken.save(),
            Formulario.findByIdAndDelete(id),
            emailAceptarFormulario({destino: formData.email, token: newToken._id, })
        ]).then(([tokenNuevo])=> {
            res.json({ codigo: tokenNuevo._id, message: "Confirmado con exito!", formData }) 
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const eliminarForm = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: "ID Invalida"});
        await Formulario.findByIdAndDelete(id);
        res.json({message: "Hecho"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const codigoGestor = async (req, res) => {
    try {
        const { companyId } = req.body
        if (!companyId) return res.status(404).json({ message: 'No se especificó ninguna compania' })
        const newToken = new Token({
            companyId,
            rol: "gestor"
        })
        const nuevoToken = await newToken.save()
        res.json({ codigo: nuevoToken._id }) //ver de enviar por mail una url
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const eliminarCuenta = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) return res.status(404).json("No se encontraron usuarios con esa ID");
    await Usuario.findByIdAndRemove(req.body.id);
    res.json({ message: 'Usuario eliminado con éxito!' })
}

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('+refreshTokens')
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
