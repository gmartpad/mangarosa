const { verify } = require('jsonwebtoken');
const verifyJWT = require('../middleware/verifyJWT');
const Registro = require('../models/registros');

module.exports = app => {

    app.get('/registros', verifyJWT, (req, res) => {
        Registro.lista(res);
    })

    app.get('/registros/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);

        Registro.buscaPorId(id, res);
    })

    app.get('/registros/:id_usuario/:idnregistrousuario', verifyJWT, (req, res) => {
        const id_usuario = parseInt(req.params.id_usuario);
        const idnregistrousuario = parseInt(req.params.idnregistrousuario);

        Registro.buscaPorIdDuplo(id_usuario, idnregistrousuario, res);
    })

    app.post('/registros', verifyJWT, (req, res) => {

        const registro = req.body;

        Registro.adiciona(registro, res);

    })

    app.patch('/registros/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;

        Registro.altera(id, valores, res);
    })

    app.delete('/registros/:id', verifyJWT, (req, res) => {
        const id = parseInt(req.params.id);
        Registro.deleta(id, res);
    })

}