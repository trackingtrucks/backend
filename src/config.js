import {config} from 'dotenv'
config();

export default {
    DATABASE_URL: process.env.CONNECTION_URL || null,
    PORT: process.env.PORT || 5000,
    SECRET: process.env.SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
    ACCESS_TOKEN_EXPIRES: 1/2 * 24 * 60 * 60, //12 horas
    REFRESH_TOKEN_EXPIRES: 30 * 24 * 60 * 60 //30 dias
}