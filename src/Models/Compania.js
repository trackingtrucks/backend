import { Schema, model } from 'mongoose';

const companyScheme = new Schema({
    companyId: {
        type: String,
        unique: true
    },
    nombre: {
        type: String
    },
    settings:{
        type: Object
    }
}, {
    versionKey: false,
    timestamps: false
})


export default model('Compania', companyScheme)