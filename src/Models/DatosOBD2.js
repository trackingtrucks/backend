import { Schema, model } from 'mongoose';
const datosOBD2Schema = new Schema({
    vehiculo: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        }
    },
    fuelLevel: {
        type: Object
    },
    RPM: {
        type: Object
    },
    speed: {
        type: Object
    },
    coolantTemperature: {
        type: Object
    },
    pendingTroubleCodes: {
        type: [String]
    },
    kilometrosRecorridos: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('DatosOBD2', datosOBD2Schema);