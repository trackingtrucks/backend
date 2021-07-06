import { Schema, model } from 'mongoose';
const tarasSchema = new Schema({
    vehiculo: {
        ref: "Vehiculo",
        type: Schema.Types.ObjectId,
        required: true
    },
    tipo: {
        type: String,
        
    },
    cantidadCada: Number,
    cantidadActual: Number
}, {
    timestamps: true,
    versionKey: false
})

export default model('Data', tarasSchema)