import { Schema, model } from 'mongoose';
const dataSchema = new Schema({
    vehiculo: {
        ref: "Vehiculo",
        type: Schema.Types.ObjectId,
        required: true
    },
    data: {
        type: Object
    },
    companyId: {
        select: false,
        type: String
    }
}, {
    timestamps: false,
    versionKey: false
})

dataSchema.statics.function = async () => {
    return await "Hola";
}

export default model('Data', dataSchema)