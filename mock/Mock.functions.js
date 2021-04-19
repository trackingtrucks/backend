const mock = [];

mock.root = async (req, res) => {
    res.json({
        message: "Bienvenido!"
    })
}

module.exports = mock;