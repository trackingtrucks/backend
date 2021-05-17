
//exportamos la funcion root, esto se ejecutaria en "/" y se llama desde el router como Mock.root"
export const root = async (req, res) => {
    res.json({
        message: "Bienvenido!",
        carpeta: "/mock",
    })
}

export const generarError = (req, res) => {
    const code = req.params.code
    try {
        res.status(code).json({
            status: parseInt(code, 10),
            message: `Codigo ${code} generado con exito!`
        }).catch(err =>{
            res.json("Haz tratado de crear un codigo que no existe/no es posible, por favor, chequea que este correcto!")
        })
    } catch (error) {
        res.json("Haz tratado de crear un codigo que no existe/no es posible, por favor, chequea que este correcto!")
    }

}

