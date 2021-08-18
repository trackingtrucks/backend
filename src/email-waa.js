import emailjs from 'emailjs-com';
// emailjs.init("user_68ReS4SouZoa39qJ4VnZh");
// import config from './config';
import axios from 'axios';

async function enviarMail({ templateId, params }) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.emailjs.com/api/v1.0/email/send",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        service_id: "service_w5hjgkq",
        template_id: templateId,
        user_id: "user_68ReS4SouZoa39qJ4VnZh",
        accessToken: "5d297a20d48ca263c9c530802c77b92f",
        template_params: {
          token: "hola",
          destino: "ezequielgatica@gmail.com",
          gestor: "pepe"
        }
      }
    });
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }

}
export async function emailAceptarCompania({ destino, gestor, token }) {
  emailjs.send("service_w5hjgkq", "tt_aceptarCompania", {
    gestor: "Juan",
    token: "987123812736",
    destino: "ezequielgatica+123@gmail.com",
  }, "user_68ReS4SouZoa39qJ4VnZh");
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