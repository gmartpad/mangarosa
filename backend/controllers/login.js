const Login = require('../models/login');
const verifyJWT = require('../middleware/verifyJWT');

module.exports = app => {

    app.post('/login', verifyJWT, (req, res) => {
        Login.fazerLogin(req, res);
    })

    app.get('/isUserAuth', verifyJWT, (req, res) => {
        Login.usuarioEstaAutenticado(req, res);
    })

}