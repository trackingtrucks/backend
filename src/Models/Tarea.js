import { Schema, model } from 'mongoose';
const tarasSchema = new Schema({
    vehiculo: {
        ref: "Vehiculo",
        type: Schema.Types.ObjectId,
        required: true
    },
    tipo: {
        type: String,
        enum: {
            values: ['Aceite', 'Neumaticos'],
            message: "Tipo de tarea '{VALUE}' inválido"
        },
    },
    cantidadCada: Number,
    cantidadUltima: Number
}, {
    timestamps: false,
    versionKey: false
})

export default model('Tarea', tarasSchema)