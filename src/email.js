import nodemailer from 'nodemailer';
import config from './config';

const emailer = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: config.EMAIL_ADDRESS,
    pass: config.EMAIL_PASSWORD,
  },
});;

async function enviarMail({ para, subject, html }) {
  if (!para || !subject || !html) throw new Error("Faltan 1 o mas parametros requeridos");
  try {
    await emailer.sendMail({
      from: `"Tracking Trucks 🚍" <${config.EMAIL_ADDRESS}>`,
      to: para,
      subject,
      html
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailAceptarCompania({ destino, gestor, token}) {
  try {
    await enviarMail({
      para: destino,
      subject: `${gestor.nombre} te ha invitado a unirse a su compania! - Tracking Trucks`,
      html: `
      <h1>Bienvenido!</h1>
      <p>Presiona el link para crear tu cuenta</p>
      <a href="https://trackingtrucks.netlify.app/registro?codigo=${token}&email=${destino}">Click aqui!</a>
      `
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailEnvioFormulario({ destino}) {
  try {
    await enviarMail({
      para: destino,
      subject: `Hemos recibido tu formulario! - Tracking Trucks`,
      html: `
      <h1>Gracias por contactarnos!</h1>
      <p>Estaremos en contacto contigo en breve!</p>
      `
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailAceptarFormulario({destino, token}){
  try {
    await enviarMail({
      para: destino,
      subject: `Bienvenido a Tracking Trucks, crea tu cuenta!`,
      html: `
      <p>Para terminar con el registro, por favor</p>
      <a href="https://trackingtrucks.netlify.app/registro?codigo=${token}&email=${destino}">Haz click aqui!</a>
      `
    });
  } catch (error) {
    console.error(error);
  }
}