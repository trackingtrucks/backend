import {Schema, model} from 'mongoose';

const tokenSchema = new Schema({
    companyId: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    gestorData: {
        type: Object,
        required: false,
        default: null
    }
},{
    versionKey: false,
    timestamps: false
})


export default model('Token', tokenSchema)