let lista = [];

export const add = ({ id, company, ucid, gen, socket }) => {
    // const usuarioYaExiste = users.find(u => u.sala === sala && u.nombre === nombre);
    const usuario = { id, company, ucid, gen, socket };
    lista.push(usuario);
    return { message: "Nuevo usuario: ", usuario }
}

export const remove = (id) => {
    const i = lista.findIndex((u) => u.ucid === id);
    if (i !== -1) {
        return lista.splice(i, 1)[0];
    }
}

export const get = (id) => {
    return lista.find((usuario) => usuario.id === id);
}

export const getAll = () => {
    return lista;
}
import { disconnectById } from '../index'

export const cerrarSesion = (gen) => {
    const listaABorrar = lista.filter((u) => u.gen === gen)
    listaABorrar.forEach((user) => {
        disconnectById(user.ucid)
    })
    lista = lista.filter((u) => u.gen !== gen)
    return lista;
}
export const cerrarSesionTodosLosDispositivos = (id) => {
    const listaABorrar = lista.filter((u) => u.id === id)
    listaABorrar.forEach((user) => {
        disconnectById(user.ucid)
    })
    lista = lista.filter((u) => u.id !== id)
    return lista;
}

