import Usuario from '../Models/Usuario'
import Role from '../Models/Role'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import config from '../config'
const secret = config.SECRET;

export const eliminar = async (req, res) => {
    const _id = req.body.id
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json("No se encontraron usuarios con esa ID");

    await Usuario.findByIdAndRemove(_id);

    res.json({ message: 'Usuario eliminado con éxito!' })
}

export const getByCompanyId = async (req, res) => {
    try {
        const companyId = req.body.companyId
        const usuarios = await Usuario.find({ companyId })
        // const gestores = usuarios.filter((user) => user.roles.map((rol) => console.log(rol)))
        return res.json(usuarios)
    } catch (error) {
        res.status(500).json({ message: error })
    }

}