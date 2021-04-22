
//exportamos la funcion root, esto se ejecutaria en "/" y se llama desde el router como Mock.root"
export const root = async (req, res) => {
    res.json({
        message: "Bienvenido!",
        carpeta: "/mock"
    })
}


