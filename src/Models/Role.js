import {Schema, model} from 'mongoose';

export const ROLES = ["user", "admin", "moderador"]

const rolesSchema = new Schema({
    nombre: String,
},{
    versionKey: false
})


export default model('Role', rolesSchema)