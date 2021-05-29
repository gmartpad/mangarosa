const Usuario = require('../models/usuarios');
const verifyJWT = require('../middleware/verifyJWT');

module.exports = app => {

    app.get('/usuarios', verifyJWT, (req, res) => {
        Usuario.lista(res);
    })

    app.get('/usuarios/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);

        Usuario.buscaPorId(id, res);
    })

    app.get('/usuarios/nome/:usuario', verifyJWT, (req, res) => {
        const usuario = req.params.usuario;

        Usuario.buscaPorUsuario(usuario, res);
    })

    app.post('/usuarios', verifyJWT, (req, res) => {

        const usuario = req.body;

        Usuario.adiciona(usuario, res);

    })

    app.patch('/usuarios/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;

        Usuario.altera(id, valores, res);
    })

    app.delete('/usuarios/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);
        Usuario.deleta(id, res);
    })

}