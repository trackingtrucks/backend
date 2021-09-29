const lista = [];

export const add = ({ id, company, ucid, gen  }) => {
    // const usuarioYaExiste = users.find(u => u.sala === sala && u.nombre === nombre);
    const usuario = {id, company, ucid, gen};
    lista.push(usuario);
    return {message: "Nuevo usuario: ", usuario}
}

export const remove = (id) => {
    const i = lista.findIndex((u) => u.ucid === id);
    if (i !== -1){
        return lista.splice(i, 1)[0];
    } 
}

export const get = (id) => {
    return lista.find((usuario) => usuario.id === id);
}

export const getAll = () => {
    return lista;
}

export const cerrarSesion = ({gen}) => {

    return lista;
}

export const cerrarSesionTodosLosDispositivos = ({id}) => {

    return lista;
}

