import { Schema, model } from 'mongoose';
const dataCronSchema = new Schema({
    fecha: { type: Date },
    destino: { type: String }
}, {
    timestamps: false,
    versionKey: false,
})

export default model('DataCrons', dataCronSchema);