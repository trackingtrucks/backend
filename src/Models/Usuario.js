import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs'
const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    rol: {
        type: String,
        required: true,
        enum: ['gestor', 'admin', 'conductor']

    },
    companyId: {
        type: String,
        required: true
    },
    agregadoPor:{
        type: Object,
        select: false
    },
    vehiculoActual: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        },
        fechaDesde: {
            type: Date,
        }
    },
    vehiculosPasados: [{
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        },
        fechaDesde: {
            type: Date,
        },
        fechaHasta: {
            type: Date,
        },
        type: {type: String}
    }],
    turnoActual:{
        id: {
            ref: "Turno",
            type: Schema.Types.ObjectId
        },
        fechaAsignado: {
            type: Date,
        }
    },
    turnosPendientes: [{
        id: {
            ref: "Turno",
            type: Schema.Types.ObjectId
        },
        fechaAsignado: {
            type: Date
        },
        type: {type: String}
    }],
    turnosPasados: [{
        id: {
            ref: "Turno",
            type: Schema.Types.ObjectId
        },
        fechaAsignado: {
            type: Date
        },
        fechaTerminado: {
            type: Date
        },
        type: {type: String}
    }],
    refreshTokens:{
        type: [String],
        select: false
    },
    createdAt:{
        type: Date,
        default: new Date(),
        immutable: true
    },
    sesionesActivas: {
        type: Number
    }
}, {
    timestamps: false,
    versionKey: false,
})

usuarioSchema.statics.encriptarPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
}
usuarioSchema.statics.verificarPassword = async (password, passwordRecibida) => {
    return await bcrypt.compare(password, passwordRecibida)
}

export default model('Usuario', usuarioSchema)