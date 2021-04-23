import {Schema, model} from 'mongoose';

export const ROLES = ["conductor", "gestor", "admin"]

const rolesSchema = new Schema({
    nombre: String,
},{
    versionKey: false
})


export default model('Role', rolesSchema)