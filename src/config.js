import {config} from 'dotenv'
config();

export default {
    DATABASE_URL: process.env.CONNECTION_URL || null,
    PORT: process.env.PORT || 5000,
    SECRET: process.env.SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
    // NOTA: CAMBIAR DE 12 HORAS A 3 MINUTOS, ESTO ES DE DEBUG
    ACCESS_TOKEN_EXPIRES: 1/2 * 24 * 60 * 60, //12 horas
    // ACCESS_TOKEN_EXPIRES: 3 * 60, //3 minutos
    REFRESH_TOKEN_EXPIRES: 30 * 24 * 60 * 60 //30 dias
}