import Usuario from '../Models/Usuario'
import CONFIG from '../config'
// import crons from './cronJobs'
export const initSetup = async () => {
    // crons.fetchAll();
    const usuarioCount = await Usuario.estimatedDocumentCount()
    if (usuarioCount > 0) {
    } else {
        try {
            await Promise.all([
                new Usuario({
                    nombre: "Eze",
                    apellido: "Gatica",
                    email: "ezequielgatica@gmail.com",
                    password: await Usuario.encriptarPassword(CONFIG.DEFAULT_ADMIN_PASSWORD),
                    companyId: 'admins',
                    rol: 'admin'
                }).save(),
            ])
            console.info("Cuentas predeterminadas creadas");
        } catch (error) {
            console.error(error)
        }
    }
}