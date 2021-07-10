import { Schema, model } from 'mongoose';
const formSchema = new Schema({
    nombreEmpresa: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    descripcionUso: {
        type: String,
        required: true
    },
    genteCompania: {
        type: String,
        required: true
    },
    enviado:{
        type: Date,
        default: new Date(),
        immutable: true
    }

}, {
    timestamps: false,
    versionKey: false
})

export default model("Form", formSchema)