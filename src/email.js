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



export default async function enviarMail({ para, subject, html }) {
  if (!para || !subject || !html) throw new Error("Faltan 1 o mas parametros requeridos");
  try {
    await emailer.sendMail({
      from: `"Tracking Trucks 🚍" <${config.EMAIL_ADDRESS}>`,
      to: para,
      subject,
      html
    });
  } catch (error) {
    console.log(error);
  }
}