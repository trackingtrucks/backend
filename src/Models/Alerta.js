import { Schema, model } from 'mongoose';
const alertaSchema = new Schema({
    tipo: String,
    nivel: String,
    cantidad: Number,
    quePasa: String,
    companyId: String,
    vehiculo: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: false,
    versionKey: false
})

export default model("Alerta", alertaSchema)