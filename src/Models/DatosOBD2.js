import { Schema, model } from 'mongoose';
const datosOBD2Schema = new Schema({
    vehiculo: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        }
    },
    fuelLevel: {
        type: {type: String}
    },
    RPM: {
        type: {type: String}
    },
    speed: {
        type: {type: String}
    },
    coolantTemperature: {
        type: {type: String}
    },
    pendingTroubleCodes: {
        type: [String]
    },
    kilometrosRecorridos: {
        type: {type: String}
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('DatosOBD2', datosOBD2Schema);