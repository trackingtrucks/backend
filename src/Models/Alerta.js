import { Schema, model } from 'mongoose';
const alertaSchema = new Schema({
    tipo: String,
    nivel: String,
    cantidad: Number,
    quePasa: String,
    companyId: {
        select: false,
        type: String
    },
    vehiculo: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: false,
    versionKey: false
})

export default model("Alerta", alertaSchema)