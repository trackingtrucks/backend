import Usuario from '../Models/Usuario'
import Token from '../Models/Token'
import Turno from '../Models/Turno'
import Vehiculo from '../Models/Vehiculo'
// import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
// import config from '../config'
// const secret = config.SECRET;

export const eliminar = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) return res.status(404).json("No se encontraron usuarios con esa ID");
    await Usuario.findByIdAndRemove(req.body.id);
    res.json({ message: 'Usuario eliminado con éxito!' })
}

export const getAll = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('+refreshTokens')
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const returnData = async (req, res) => {
    res.json(req.userData)
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
export const codigoConductor = async (req, res) => {
    try {
        const newToken = new Token({
            companyId: req.userData.companyId,
            rol: "conductor",
            gestorData: {
                id: req.userId,
                email: req.userData.email
            }
        })
        const nuevoToken = await newToken.save()
        res.json({ codigo: nuevoToken._id }) //ver de enviar por mail una url
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const codigoCheck = async (req, res) => {
    try {
        const { codigo } = req.body
        if (!codigo) return res.status(404).json({ message: 'No se especificó ningun codigo' })
        const response = await Token.findById(codigo)
        if (!response) return res.status(401).json({ valid: false })
        res.json({ valid: true })
    } catch (error) {
        res.status(500).json({ message: error.message, valid: false })
    }
}


import { sendMessage } from '../index'

export const socketTest = async (req, res) => {
    try {
        sendMessage(req.userData.companyId, "message", req.body.message)
        res.json("ok!")
    } catch (error) {
        res.status(500).json({ message: error.message, stack: error.stack })
    }

}

export const crearTurno = async (req, res) => {
    try {
        const companyId = req.userData.companyId;
        const { codigoDeTurno,  fechaYhora, nombreVendedor, codigoOrdenDeCompra} = req.body;
        if(!nombreVendedor || !codigoOrdenDeCompra) return res.status(400).json({ message: 'Faltan 1 o mas campos requeridos'});
        const nuevoTurno = new Turno({
            codigoDeTurno,
            fechaYhora: fechaYhora.toLocaleString(),
            nombreVendedor,
            codigoOrdenDeCompra,
            companyId
        });
        const turnoNuevo = await nuevoTurno.save();
        return res.status(200).json({
            turno: turnoNuevo,
            message: 'Turno creado con exito'
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}