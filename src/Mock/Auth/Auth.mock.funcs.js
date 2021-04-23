import config from '../../config'
const secret = config.SECRET;
import jwt from 'jsonwebtoken'
export const auth = {
    user: async (req, res) => {
        res.json({
            message: 'Hola!',
            carpeta: "/mock/auth"
        })
    },
    login: async (req, res) => {
        const token = jwt.sign({
            id: "112233445566",
        }, secret, {
            expiresIn: 86400 // 24 horas
        })
        res.json({token})
    },
    register: async (req, res) => {
        const token = jwt.sign({
            id: "112233445566",
        }, secret, {
            expiresIn: 86400 // 24 horas
        })
        res.json({token})
    },
    error: {
        wrongpassword: async (req, res) => {
            res.status(401).json({token: null, message: 'Contraseña invalida'})
        },
        usernotfound: async (req, res) => {
            res.status(400).json({token: null, message: 'Usuario no encontrado' })
        },
        useryaexiste: async (req, res) => {
            res.status(400).json({message: 'Usuario ya existe'})
        },
        emailyausado: async (req, res) => {
            res.status(400).json({message: 'Email ya existe'})
        }
    }
}


