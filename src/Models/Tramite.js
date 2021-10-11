import { Schema, model } from 'mongoose';
const tramiteSchema = new Schema({
    vehiculo: {
        ref: "Vehiculo",
        type: Schema.Types.ObjectId
    },
    companyId: {
        type: String
    },
    date: {
        type: Date
    },
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    ultimaVez: {
        type: Date
    },
    urgencia: {
        enum: ['urgente', 'moderado'],
        type: String,
        default: "moderado"
    },
    companyId: {
        type: String
    }
}, {
    timestamps: false,
    versionKey: false
});

export default model('Tramite', tramiteSchema);