import { Schema, model } from 'mongoose';
const vehiculoSchema = new Schema({
    patente: {
        type: String,
        required: true,
        unique: true
    },
    patenteFormato: {
        type: Number,
        required: true
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
        id: {
            ref: "Usuario",
            type: Schema.Types.ObjectId
        },
        fechaDesde: {
            type: Date,
        }
    },
    conductoresPasados: [{
        id: {
            ref: "Usuario",
            type: Schema.Types.ObjectId
        },
        fechaDesde: {
            type: Date,
        },
        fechaHasta: {
            type: Date,
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