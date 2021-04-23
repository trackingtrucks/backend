import Role from '../Models/Role'
export const crearRoles = async () => {
    const count = await Role.estimatedDocumentCount()

    if (count > 0) return;
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