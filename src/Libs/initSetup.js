import Role from '../Models/Role'
import Usuario from '../Models/Usuario'
import CONFIG from '../config'
export const crearRoles = async () => {
    const count = await Role.estimatedDocumentCount()
    const usuarioCount = await Usuario.estimatedDocumentCount()
    if (count > 0) {
    } else {
        try {
            const values = await Promise.all([
                new Role({ nombre: 'conductor' }).save(),
                new Role({ nombre: 'admin' }).save(),
                new Role({ nombre: 'gestor' }).save()
            ])
            console.log(values);
        } catch (error) {
            console.error(error)
        }
    }
    if (usuarioCount > 0) {

    } else {
        try {
            const adminRole = await Role.findOne({ nombre: "admin" })
            const values = await Promise.all([
                new Usuario({
                    nombre: "Eze",
                    apellido: "Gatica",
                    email: "ezequielgatica@gmail.com",
                    password: await Usuario.encriptarPassword(CONFIG.DEFAULT_ADMIN_PASSWORD),
                    companyId: 'admins',
                    roles: [adminRole._id]
                }).save(),
            ])
            console.log(values);
        } catch (error) {
            console.error(error)
        }
    }



}