import { Schema, model } from 'mongoose';

const companyScheme = new Schema({
    companyId: {
        type: String,
        unique: true
    },
    nombre: {
        type: String
    },
    alertas: {
        type: Object,
        default: {
            alertaMedia: true,
            alertaAlta: true,
            subirAuto: true,
            bajarAuto: true,
            empiezaEntrega: true,
            terminaEntrega: true,
            notificacionTramite: true
        }
    },
    _id: String
}, {
    versionKey: false,
    timestamps: false
})


export default model('Compania', companyScheme)