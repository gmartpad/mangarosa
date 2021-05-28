const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) {
        res.status(400).json({
            message: 'Nós precisamos de um token. Passa pra gente da próxima vez'
        })
    } else { 
        jwt.verify(token, process.env.JWT_SECRET, (erro, decoded) => {
            if(erro){
                res.status(401).json({
                    auth: false,
                    message: 'Autenticação falhou'
                })
            } else {
                req.idUsuario = decoded.id;
                next();
            }
        })
    }
}