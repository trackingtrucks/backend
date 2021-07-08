import { Schema, model } from 'mongoose';
const datosOBD2Schema = new Schema({
    vehiculo: {
        id: {
            ref: "Vehiculo",
            type: Schema.Types.ObjectId
        }
    },
    fuelLevel: [{
        datos: [{type: String}],
        type: [String],
        required: true
    }],
    RPM: [{
        datos: [{type: String}],
        type: [String],
        required: true
    }],
    speed: [{
        datos: [{type: String}],
        type: [String],
        required: true
    }],
    coolantTemperature: [{
        datos: [{type: String}],
        type: String,
        required: true
    }],
    pendingTroubleCodes: [{
        datos: [{type: String}],
        type: [String]
    }]
}, {
    timestamps: false,
    versionKey: false
});

export default model('DatosOBD2', datosOBD2Schema);