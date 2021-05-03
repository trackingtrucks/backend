import {Schema, model} from 'mongoose';

const tokenSchema = new Schema({
    companyId: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    }
},{
    versionKey: false
})


export default model('Token', tokenSchema)