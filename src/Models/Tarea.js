import { Schema, model } from 'mongoose';
const tareasSchema = new Schema({
    vehiculo: {
        ref: "Vehiculo",
        type: Schema.Types.ObjectId,
        required: true
    },
    tipo: {
        type: String,
        enum: {
            values: ['aceite', 'neumaticos'],
            message: "Tipo de tarea '{VALUE}' inválido"
        },
    },
    cantidadCada: Number,
    cantidadUltima: Number
}, {
    timestamps: false,
    versionKey: false
})

export default model("Tarea", tareasSchema)