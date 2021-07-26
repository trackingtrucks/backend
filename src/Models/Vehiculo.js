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
    kmactual: {
        type: Number,
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
        },
        type: { type: String }
    }],
    notaGestor: String,
    tareas: [{
        ref: "Tarea",
        type: Schema.Types.ObjectId
    }],
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    alertas: {
        type: [Object],
        tipo: {
            enum: ['aceite', 'rueda', 'falla'],
            type: String
        },
        nivel: {
            enum: ['bajo', 'medio', 'alto'],
            type: String
        },
        cantidad: Number,
        quePasa: {
            enum: ['sobra', 'falta'],
            type: String
        }
    }
}, {
    timestamps: false,
    versionKey: false
})

vehiculoSchema.statics.function = async () => {
    return await "Hola";
}

export default model('Vehiculo', vehiculoSchema)