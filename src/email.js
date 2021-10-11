import config from './config'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY)

async function enviarMail({ para, subject, html }) {
  if (!para || !subject || !html) throw new Error("Faltan 1 o mas parametros requeridos");
  sgMail.send({
    to: para,
    from: `Tracking Trucks 🚍 <soygati@gmail.com>`,
    subject,
    html,
    text: html
  })

}
export async function emailAceptarCompania({ destino, gestor, token }) {
  try {
    await enviarMail({
      para: destino,
      subject: `${gestor.nombre} te ha invitado a unirse a su compañia! - Tracking Trucks`,
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
export async function emailCambioContraseña({ destino }) {
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

export async function emailTurno({ destino }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Tiene un turno pronto`,
      html: `
      <h1>Hola!</h1>
      <p>Este es un mail para recordarte que dentro de dos días tendrás un turno, así que asegurate de tener listo tu camión</p>
      `
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailTramite({ destino, tituloTramite, vehiculo }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Se venció la fecha del tramite de ${tituloTramite}`,
      html: `
      <h1>Hola!</h1>
      <p>Este es un mail para notificarte que el tramite de ${tituloTramite} del vehiculo ${vehiculo} venció.</p>
      <p>Recordá de mantener todos tus tramites al día.</p>
      `
    });
  } catch (error) {
    console.error(error);
  }
}