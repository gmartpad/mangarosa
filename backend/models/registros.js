const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const bcrypt = require('bcrypt');
const format = require('sqlutils/pg/format');


class Registro {
    adiciona(registro, res) {

        const datetimeregistro = moment().format('YYYY-MM-DD HH:mm:ss');

        const registroDatado = {
            ...registro,
            datetimeregistro
        }

        const sqlCheck = `SELECT * FROM registrodeponto.Usuarios WHERE id_usuario=${registroDatado.usuario}`;

        conexao.query(sqlCheck, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{

                const nomeEhValido = registroDatado.nome === resultados.rows[0].nome;

                const emailEhValido = registroDatado.email === resultados.rows[0].email;

                const cpfEhValido = registroDatado.cpf === resultados.rows[0].cpf;

                const celularEhValido = registroDatado.celular !== undefined ? /\(?[0-9]{2}\)?\s*[0-9]{5}\s*\-?\s*[0-9]{4}/.test(registroDatado.celular) : true;

                const validacoes = [
                    {
                        nome: 'nome',
                        valido: nomeEhValido,
                        mensagem: 'Este não é seu nome. Talvez você o tenha escrito errado?'
                    },
                    {
                        nome: 'email',
                        valido: emailEhValido,
                        mensagem: 'Este não é seu email, talvez você o tenha escrito errado?'
                    },
                    {
                        nome: 'cpf',
                        valido: cpfEhValido,
                        mensagem: 'Este não é seu cpf, talvez você o tenha escrito errado?'
                    },
                    {
                        nome: 'celular',
                        valido: celularEhValido,
                        mensagem: 'O seu número de celular não está no formato válido. Ex: (48) 9 9999-9999'
                    }
                ];

                const erros = validacoes.filter(campo => !campo.valido);
                const existemErros = erros.length;

                if(existemErros){
                    res.status(400).json(erros);
                }else{

                    delete registroDatado.nome;
                    delete registroDatado.email;
                    delete registroDatado.cpf;
                
                    const sqlCount = `SELECT COUNT(*) FROM registrodeponto.Registros WHERE usuario = ${registroDatado.usuario}`;
                    
                    conexao.query(sqlCount, (erro, resultados) => {
        
                        if(erro){
                            res.status(400).json(erro)
                        } else {
        
                            const registroComID = {
                                idnregistrousuario: parseInt(resultados.rows[0].count)+1,
                                ...registroDatado
                            }
        
                            const sqlInsert = format('INSERT INTO registrodeponto.Registros ?', registroComID);
        
                            conexao.query(sqlInsert, (erro, resultados) => {
                                if(erro){
                                    res.status(400).json(erro.message);
                                }else{
                                    res.status(201).json(registroComID)
                                }
                            })
        
                        }
        
                    })
        
                }

            }

        })

    }

    lista(res) {
        const sql = "SELECT * FROM registrodeponto.Registros";

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                if(resultados.rows.length >= 2){
                    res.status(201).json(resultados.rows)
                } else {
                    res.status(201).json(...resultados.rows)
                }
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM registrodeponto.Registros WHERE id_usuario=$1`;

        conexao.query(sql, [id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(...resultados.rows);
            }
        })
    }

    altera(id, valores, res) {
        const sql = format(`UPDATE registrodeponto.Registros SET ? WHERE id_usuario=${id}`, valores);

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json({...valores, id});
            }
        })
    }

    deleta(id, res) {
        const sql = `DELETE FROM registrodeponto.Registros WHERE id_usuario=${id}`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro.message);
            } else {
                res.status(201).json({id});
            }
        })
    }
}

module.exports = new Registro;