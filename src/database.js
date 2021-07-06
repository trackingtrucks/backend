import mongoose from 'mongoose';
import config from "./config";

mongoose.Promise = Promise;

mongoose.connect(config.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})
.then(() => {console.log("Base de datos conectada con éxito!");})
.catch((err) => {console.error(err)});