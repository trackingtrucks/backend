import { Schema, model } from 'mongoose';
const datosOBD2Schema = new Schema({
    vehiculo: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        }
    },
    fuelLevel: {
        type: [String]
    },
    RPM: {
        type: [String]
    },
    speed: {
        type: [String]
    },
    coolantTemperature: {
        type: [String]
    },
    pendingTroubleCodes: {
        type: [String]
    },
    kilometrosRecorridos: {
        type: [String]
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('DatosOBD2', datosOBD2Schema);