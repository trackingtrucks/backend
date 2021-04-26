import {config} from 'dotenv'
config();

export default {
    DATABASE_URL: process.env.CONNECTION_URL || null,
    PORT: process.env.PORT || 5000,
    SECRET: process.env.SECRET,
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD
}