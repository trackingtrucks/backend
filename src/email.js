import config from './config'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY)

async function enviarMail({ para, templateId, data }) {
  sgMail.send({
    to: para,
    from: `Tracking Trucks 🚍 <noreply@em651.trackingtrucks.ezegatica.online>`,
    templateId: templateId,
    personalizations: [
      {
        "to": [
          {
            "email": para
          }
        ],
        "dynamic_template_data": data
      }
    ],
  })
}
export async function emailAceptarCompania({ destino, gestor, token }) { //Cuando se invita a un conductor a la empresa
  try {
    await enviarMail({
      para: destino,
      data: {
        gestor: gestor.nombre,
        token,
        email: destino
      },
      templateId: "d-64674dd154b24d68ac715b84159e9ab8"
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailEnvioFormulario({ destino }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-b22aa2819db8471b898d4cb74610ca9c",
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailAceptarFormulario({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      data: {
        token,
        destino
      },
      templateId: "d-f1b8284aba634387829f0d6d46bd0420"
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailRegistroAdmin({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-840f31ce35ab4fd4b9cc06da101f92e2",
      data: {
        destino,
        token
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailRestablecerContraseña({ destino, token }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-89d29c875ad74648a6f8ad579d57f0ed",
      data: {
        destino,
        token
      }
    });
  } catch (error) {
    console.error(error);
  }
}
export async function emailCambioContraseña({ destino }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-ba124f89a1b5473fbe2a8735fde4224d"
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailTurno({ destino }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-4eb68e494126455faf4c9c07dbb4933d"
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailTramite({ destino, tituloTramite, vehiculo }) {
  try {
    await enviarMail({
      para: destino,
      templateId: "d-315468131f954f6f8837a62fcf1fe452",
      data: {
        tituloTramite,
        vehiculo,
        subject: `Se venció la fecha del tramite de ${tituloTramite}`
      }
    });
  } catch (error) {
    console.error(error);
  }
}