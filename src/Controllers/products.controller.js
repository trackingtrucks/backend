import Producto from '../Models/Product'

// AGREGAR TRYCATCHS CON LOS ERRORES
export const get = async (req, res) => {
    const productos = await Producto.find()
    res.status(200).json(productos)
}

export const crear = async (req, res) => {
    const { nombre, categoria, precio, imgURL } = req.body;
    const nuevoProducto = new Producto({
        nombre,
        categoria,
        precio,
        imgURL
    })
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado)
}

export const getById = async (req, res) => {
    const producto = await Producto.findById(req.params.id)
    res.status(200).json(producto)
}

export const update = async (req, res) => {
    const { nombre, categoria, precio, imgURL } = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, {
        nombre,
        categoria,
        precio,
        imgURL
    }, {
        new: true
    })
    res.status(200).json(productoActualizado)

}

export const borrar = async (req, res) => {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id)
    res.status(204).json(productoEliminado)

}
