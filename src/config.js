import {config} from 'dotenv'
config();

export default {
    DATABASE_URL: process.env.CONNECTION_URL || undefinded,
    PORT: process.env.PORT || 5000,
    SECRET: process.env.SECRET
}