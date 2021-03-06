import Usuario from '../Models/Usuario'
import Vehiculo from '../Models/Vehiculo';
import Turno from '../Models/Turno'
import { formatPatente } from '../Controllers/vehiculo.controller'

export const emailIsValid = async (req, res, next) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid =  re.test(req?.body?.email);
    if (!valid){return res.status(400).json({message: 'Email invalido'})}
    next();
}

export const existeUsuarioOEmail = async (req, res, next) => {
    const email = await Usuario.findOne({ email: req.body.email }).select("email");
    if (email) return res.status(400).json({ message: 'Email ya existe' })
    next();
}

export const existePatenteRegistrada = async (req, res, next) => {
    const patente = await Vehiculo.findOne({ patente: formatPatente(req.body.patente) }).select("patente");
    if (patente) return res.status(400).json({ message: 'Patente ya registrada' })
    next();
}

export const usuarioYaAsignado = async (req, res, next) => {
    const { patente } = req.body
    if (!patente) return res.status(400).json({ message: 'Patente no especificada' })
    const usuario = await Vehiculo.findOne({ "conductorActual.id": req.userId })
    const vehiculo = req.userData?.vehiculoActual?.id;
    if (vehiculo || usuario) return res.status(400).json({ message: 'Este usuario esta asignado a otro vehiculo' })
    next();
}

export const vehiculoYaAsignado = async (req, res, next) => {
    const patente = req.body?.patente;
    const vehiculo = await Vehiculo.findOne({ patente: formatPatente(patente) })
    if (!vehiculo) return res.status(400).json({ message: 'No se encontraron vehiculos con esa patente' })
    if (vehiculo?.conductorActual?.id) return res.status(400).json({ message: 'Este vehiculo esta asignado a otro usuario' })
    req.vehiculoData = vehiculo;
    req.vehiculoId = vehiculo._id;
    next();
}

export const usuarioNoAsignado = async (req, res, next) => {
    const usuario = await Vehiculo.findOne({ "conductorActual.id": req.userId })
    const vehiculo = req.userData?.vehiculoActual?.id;
    if (!vehiculo || !usuario) return res.status(400).json({ message: 'Este usuario no esta asignado a ningun vehiculo' })
    req.vehiculoId = vehiculo;
    next();
}

export const vehiculoNoAsignado = async (req, res, next) => {
    const vehiculo = await Vehiculo.findById( req.vehiculoId ).populate("tareas").populate("alertas")
    if (!vehiculo?.conductorActual?.id) return res.status(400).json({ message: 'Este vehiculo no esta asignado a ningun usuario' })
    req.vehiculoData = vehiculo;
    next();
}

export const turnoYaCreado = async (req, res, next) => {
    const codigoDeTurno = req.body?.codigoDeTurno;
    if(!codigoDeTurno) return res.status(400).json({ message: 'Hay campos necesarios vacios'});
    const turno = await Turno.findOne({ codigoDeTurno });
    if(turno) return res.status(400).json({ message: 'Este turno ya esta creado'});
    req.codigoDeTurno = codigoDeTurno;
    next();
}

export const fechaValida = async (req, res, next) => {
    var currentDate = new Date(); // creo la fecha actual
    var response = req.body?.fechaYhora; // guardo la fecha que me pasan
    if(!response) return res.status(400).json({ message: 'Hay campos necesarios vacios'}); // verifico si en el campo de fechaYhora me pasaron algo
    var fecha = new Date(response); // guardo la fecha que me pasaron como Date
    if(fecha.getTime() <= currentDate.getTime()) return res.status(400).json({ message: 'La fecha no es valida, porque es en el pasado'}); // verifico que la fecha que me pasaron no sea anterior a la fecha actual
    fecha.setDate( fecha.getDate() - 2 );
    let fechaUsada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 9, 0, 0);
    if(fechaUsada.getTime() <= currentDate.getTime()) return res.status(400).json({ message: 'La fecha no es valida para luego ser usada para avisar al conductor'})
    req.fecha = fecha;
    next();
}

export const conductorNoEncontrado = async (req, res, next) => {
    const _id = req.body?.idConductor;
    if(!_id) return res.status(400).json({ message: 'Hay campos necesarios vacios'});
    const conductorEncontrado = await Usuario.findById( _id );
    if(!conductorEncontrado) return res.status(400).json({ message: 'No se encontr?? ningun conductor con ese id'});
    if(conductorEncontrado.rol != 'conductor') return res.status(400).json({ message: 'Este id no esta asignado a un conductor'});
    req.conductor = conductorEncontrado;
    next();
}

export const turnoNoCreado = async (req, res, next) => {
    const codigoDeTurno = req.body?.codigoDeTurno;
    if(!codigoDeTurno) return res.status(400).json({ message: 'Hay campos necesarios vacios'});
    const turno = await Turno.findOne({ codigoDeTurno });
    if(!turno) return res.status(400).json({ message: 'No se encontr?? ningun turno con ese c??digo'});
    req.turno = turno;
    next();
}