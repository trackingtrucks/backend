import {Schema, model} from 'mongoose';

const tokenSchema = new Schema({
    companyId: {
        type: String
    },
    rol: {
        type: String
    },
    gestorData: {
        type: Object,
        required: false
    },
    email: {
        type: String
    },
    tipo: {
        type: String,
        required: true,
        enum: ['contraseña', 'registro']
    },
    secret: {
        type: String
    },
    expires: {
        type: Number
    }
},{
    versionKey: false,
    timestamps: false
})


export default model('Token', tokenSchema)