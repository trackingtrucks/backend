import config from '../config';
import Vehiculo from '../Models/Vehiculo';
import Usuario from '../Models/Usuario';
import Formulario from '../Models/Formulario';
import Tarea from '../Models/Tarea';
import Turno from '../Models/Turno';
import Compania from '../Models/Compania';
import Token from '../Models/Token';
import mongoose from 'mongoose';
import { socketSend } from '../index'
import { emailAceptarFormulario, emailRegistroAdmin } from '../email'
import * as mails from '../email'

export const pruebaEmail = async (req, res) => {
    res.json("done")
}

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
    res.json({ forms });
}

export const aceptarForm = async (req, res) => {
    try {
        const { companyId, id, nombre } = req.body;
        if (!companyId || !id || !nombre) return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        const formData = await Formulario.findById(id);
        if (!formData) return res.status(404).json({ message: 'ID de formulario de registro no encontrado' });
        const newToken = new Token({
            companyId,
            rol: "gestor",
            email: formData.email,
            tipo: 'registro'
        });
        const newCompany = new Compania({
            companyId,
            nombre,
            _id: companyId
        })
        // return res.json(newCompany)
        await Promise.all([
            newToken.save(),
            newCompany.save(),
            Formulario.findByIdAndDelete(id),
        ]).then(([tokenNuevo]) => {
            emailAceptarFormulario({ destino: formData.email, token: newToken._id, })
            res.json({ codigo: tokenNuevo._id, message: "Confirmado con exito!", formData })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const eliminarForm = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        await Formulario.findByIdAndDelete(id);
        res.json({ message: "Hecho" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const codigoGestor = async (req, res) => {
    try {
        const { companyId } = req.body
        if (!companyId) return res.status(404).json({ message: 'No se especific?? ninguna compania' })
        const newToken = new Token({
            companyId,
            rol: "gestor",
            tipo: 'registro'
        })
        const nuevoToken = await newToken.save()
        res.json({ codigo: nuevoToken._id }) //ver de enviar por mail una url
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const codigoAdmins = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(404).json({ message: 'No se especific?? ningun email' })
        const newToken = new Token({
            companyId: "admins",
            rol: "admin",
            email,
            tipo: 'registro'
        })
        const nuevoToken = await newToken.save()
        emailRegistroAdmin({
            destino: email,
            token: nuevoToken._id
        })
        res.json({ codigo: nuevoToken._id, message: "Enviado con ??xito!" }) //ver de enviar por mail una url
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getAllAdmins = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ rol: "admin" })
        return res.json({ admins: usuarios })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getAdminTokens = async (req, res) => {
    try {
        const tokens = await Token.find({ rol: "admin", tipo: "registro" })
        res.json({ tokens })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const elminarToken = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID Invalida" });
        await Token.findByIdAndDelete(id);
        return res.json({ message: "Token eliminado con exito" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const eliminarCuenta = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) return res.status(404).json("No se encontraron usuarios con esa ID");
    await Usuario.findByIdAndRemove(req.body.id);
    res.json({ message: 'Usuario eliminado con ??xito!' })
}

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('+refreshTokens')
        res.json({ usuarios })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const socketTest = async (req, res) => {
    const { sala, contenido, key, tipo } = req.body;
    socketSend(sala, key, contenido, tipo)
    res.sendStatus(200);
}
import { getAll } from '../Libs/socketCache'
export const socketConnections = async (req, res) => {
    const usuarios = getAll();
    return res.json(usuarios)
}
import { cerrarSesion, cerrarSesionTodosLosDispositivos } from '../Libs/socketCache'
export const socketLogout = async (req, res) => {
    const { id } = req.params;
    res.json(cerrarSesion(id))
}
export const socketLogoutAllDevices = async (req, res) => {
    const { id } = req.params;
    res.json(cerrarSesionTodosLosDispositivos(id))
}