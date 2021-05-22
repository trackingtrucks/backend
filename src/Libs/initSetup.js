import Usuario from '../Models/Usuario'
import CONFIG from '../config'
export const initSetup = async () => {
    const usuarioCount = await Usuario.estimatedDocumentCount()
    if (usuarioCount > 0) {
    } else {
        try {
            const values = await Promise.all([
                new Usuario({
                    nombre: "Eze",
                    apellido: "Gatica",
                    email: "ezequielgatica@gmail.com",
                    password: await Usuario.encriptarPassword(CONFIG.DEFAULT_ADMIN_PASSWORD),
                    companyId: 'admins',
                    rol: 'admin'
                }).save(),
            ])
            console.log(values);
        } catch (error) {
            console.error(error)
        }
    }
}