import { Schema, model } from 'mongoose';
const dataCronSchema = new Schema({
    fecha: { type: Date },
    destino: { type: String },
    tipo: {
        type: String,
        enum: ['turno', 'tramite']
    },
    tramite:{
        ref: 'Tramite',
        type: Schema.Types.ObjectId
    }

}, {
    timestamps: false,
    versionKey: false,
})

export default model('DataCrons', dataCronSchema);