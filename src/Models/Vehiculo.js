import { Schema, model } from 'mongoose';
const vehiculoSchema = new Schema({
    patente: {
        type: String,
        required: true,
        unique: true
    },
    companyId: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    año: {
        type: Number,
        required: true
    },
    conductorActual: {
        ref: "Usuario",
        type: Schema.Types.ObjectId
    },
    conductoresPasados: [{
        id: {
            ref: "Usuario",
            type: Schema.Types.ObjectId
        },
        fechaDesde: {
            type: Date,
            default: new Date()
        },
        fechaHasta: {
            type: Date,
            default: new Date()
        }
    }],
    notaGestor: String 
}, {
    timestamps: true,
    versionKey: false
})

vehiculoSchema.statics.function = async () => {
    return await "Hola";
}

export default model('Vehiculo', vehiculoSchema)