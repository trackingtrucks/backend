import { Schema, model } from 'mongoose';

const companyScheme = new Schema({
    companyId: {
        type: String,
        unique: true
    },
    nombre: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: false
})


export default model('Compania', companyScheme)