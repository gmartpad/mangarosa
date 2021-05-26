const Usuario = require('../models/usuarios');

module.exports = app => {
    app.post('/usuarios', (req, res) => {

        const usuario = req.body;

        Usuario.adiciona(usuario, res);

    })
}