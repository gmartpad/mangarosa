const conexao = require('../infraestrutura/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const removeAcento = require('../utils/removeAcento');


class Login {

    fazerLogin(req, res) {
        const nome = req.body.nome;
        const senha = req.body.senha;

        const nomeFormatado = removeAcento(nome.replace(/\s+/g, ''));

        const sql = `SELECT * FROM registrodeponto.Usuarios WHERE usuario='${nomeFormatado}'`;

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.send({
                    auth: false,
                    message: 'Nenhum usuário encontrado!'
                });
            }

            if(resultados.rows.length > 0){
                bcrypt.compare(senha, resultados.rows[0].senha, (erro, resposta) => {
                    if(erro){
                        res.send({
                            auth: false,
                            message: 'Senha incorreta!'
                        });
                    } else {
                        if(resposta){
                            
                            const id = resultados.rows[0].id_usuario;
                            
                            const token = jwt.sign({id}, process.env.JWT_SECRET, {
                                expiresIn: 300,
                            })
    
                            delete resultados.rows[0].senha;
                            
                            req.session.usuario = resultados.rows[0];
    
                            res.send({auth: true, token, result: resultados.rows[0] })
    
                        } else {
                            res.send({
                                auth: false,
                                message: 'Senha incorreta!'
                            })
                        }
                    }
                })
            } else {
                res.send({
                    auth: false,
                    message: 'Nenhum usuário com esse nome!'
                })
                // res.status(404).json({
                //     auth: false,
                //     message: 'Usuário não encontrado!'
                // })
            }

        })

    }

    usuarioEstaAutenticado(req, res) {

        if(!req.idUsuario){
            res.status(401).json({
                auth: false,
                message: 'Usuário não está autorizado'
            })
        }else{
            res.status(200).json({
                auth: true,
                message: 'Usuário está autorizado',                
            })
        }
    }

}

module.exports = new Login;