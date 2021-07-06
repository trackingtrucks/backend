import { Schema, model } from 'mongoose';
const datosOBD2Schema = new Schema({
    vehiculo: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        }
    },
    fuelLevel: {
        type: String,
        required: true
    },
    RPM: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    },
    coolantTemperature: {
        type: String,
        required: true
    },
    RPM: {
        type: String
    }
}, {
    timestamps: false,
    versionKey: false
});

export default model('DatosOBD2', datosOBD2Schema);