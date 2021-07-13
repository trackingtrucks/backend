import mongoose from 'mongoose';
import config from "./config";

mongoose.connect(config.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {console.info("Base de datos conectada con éxito!");})
.catch((err) => {console.error(err)});