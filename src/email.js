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
export async function emailAceptarCompania({ destino, gestor, token }) {
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
export async function emailEnvioFormulario({ destino }) {
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
export async function emailAceptarFormulario({ destino, token }) {
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
export async function emailRegistroAdmin({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Bienvenido Administrador, por favor, crea tu cuenta!`,
      html: `
      <p>Para terminar con el registro, <a href="https://trackingtrucks.netlify.app/registro?codigo=${token}&email=${destino}">haz click aqui!</a></p>
      `
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailRestablecerContraseña({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Restablece tu contraseña de Tracking Trucks`,
      html: `
      <p>
        <URL de front/>
      <p/>
      <p>Mientras tanto, el codigo es ${token}<p/>
        `
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailCambioContraseña({destino}){
  try {
    await enviarMail({
      para: destino,
      subject: `Su contraseña de Tracking Trucks ha cambiado`,
      html: `
      <h1>Hola!</h1>
      <p>Este es un email para avisarte que su contraseña ha cambiado, si has sido tu, ignora este email. Si no recuerdas haberlo hecho, por favor, cambia tu contraseña (link a restablecer tu contraseña)</p>
        `
    });
  } catch (error) {
    console.error(error);
  }
}