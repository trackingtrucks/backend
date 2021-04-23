import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs'
const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: "Role",
        type: Schema.Types.ObjectId,
        default: "conductor"
    }],
    companyId: {
        type: String,
        required: true
    },
    

}, {
    timestamps: true,
    versionKey: false
})

usuarioSchema.statics.encriptarPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
}
usuarioSchema.statics.verificarPassword = async (password, passwordRecibida) => {
    return await bcrypt.compare(password, passwordRecibida)
}

export default model('Usuario', usuarioSchema)