import config from './config'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY)

// export async function emailPrueba() {
//   sgMail.send({
//     to: "ezequielgatica@gmail.com",
//     from: `Tracking Trucks ๐๐๐ <soygati@gmail.com>`,
//     templateId: "d-b5db6d88d5524c92b643757b8b3c6cda",
//     personalizations: [
//       {
//         "to": [
//           {
//             "email": "ezequielgatica@gmail.com"
//           }
//         ],
//         subject: `Hemos recibido tu formulario! - Tracking Trucks`,
//         "dynamic_template_data": {
//           "subject": "Tracking Trucks - Admin",
//           "token": "todo%20bien%20mi%20rey",
//           "destino": "gatuigatigatis@gmail.com"
//         }
//       }
//     ],
//   })
// }

async function enviarMail({ para, subject, html }) {
  if (!para || !subject || !html) throw new Error("Faltan 1 o mas parametros requeridos");
  sgMail.send({
    to: para,
    from: `Tracking Trucks ๐ <soygati@gmail.com>`,
    subject,
    html,
    text: html
  })
}
export async function emailAceptarCompania({ destino, gestor, token }) {
  try {
    await enviarMail({
      para: destino,
      subject: `${gestor.nombre} te ha invitado a unirse a su compaรฑia! - Tracking Trucks`,
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

export async function emailRestablecerContraseรฑa({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Restablece tu contraseรฑa de Tracking Trucks`,
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
export async function emailCambioContraseรฑa({ destino }) {
  try {
    await enviarMail({
      para: destino,
      subject: `Su contraseรฑa de Tracking Trucks ha cambiado`,
      html: `
      <h1>Hola!</h1>
      <p>Este es un email para avisarte que su contraseรฑa ha cambiado, si has sido tu, ignora este email. Si no recuerdas haberlo hecho, por favor, cambia tu contraseรฑa (link a restablecer tu contraseรฑa)</p>
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
      <p>Este es un mail para recordarte que dentro de dos dรญas tendrรกs un turno, asรญ que asegurate de tener listo tu camiรณn</p>
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
      subject: `Se venciรณ la fecha del tramite de ${tituloTramite}`,
      html: `
      <h1>Hola!</h1>
      <p>Este es un mail para notificarte que el tramite de ${tituloTramite} del vehiculo ${vehiculo} venciรณ.</p>
      <p>Recordรก de mantener todos tus tramites al dรญa.</p>
      `
    });
  } catch (error) {
    console.error(error);
  }
}