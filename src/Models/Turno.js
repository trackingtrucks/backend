import {Schema, model} from 'mongoose';
const turnoSchema = new Schema({
    codigoDeTurno: {
        type: String,
        unique: true,
        required: true
    },
    fechaYhora: {
        type: Date,
        required: true
    },
    nombreVendedor: {
        type: String,
        required: true
    },
    codigoOrdenDeCompra: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true,
        select: false
    },
    condicion: {
        type: String
    }
}, {
    timestamps: false,
    versionKey: false
})

export default model('Turno', turnoSchema)