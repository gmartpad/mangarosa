const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
const bcrypt = require('bcrypt');
const format = require('sqlutils/pg/format');

const removeAcento = require('../utils/removeAcento');

class Usuario {
    
    adiciona(usuario, res) {
        
        const saltRounds = 12;
        
        const nomeFormatado = removeAcento(usuario.nome.replace(/\s+/g, ''));

        const nomeEhValido = usuario.nome.length >= 5;
        
        const emailEhValido = /\S+@\S+\.\S+/.test(usuario.email);
        
        const validacoes = [
            {
                nome: 'nome',
                valido: nomeEhValido,
                mensagem: 'O nome do usuário tem de possuir no mínimo 5 caracteres'
            },
            {
                nome: 'email',
                valido: emailEhValido,
                mensagem: 'O email não é um email válido'
            }
        ];
        
        const erros = validacoes.filter(campo => !campo.valido);
        
        const existemErros = erros.length;

        if(existemErros){
            res.status(400).json(erros);
        }else{

            bcrypt.hash(usuario.senha, saltRounds, function(err, hash) {
    
                const senhaHashada = hash;
    
                usuario.senha = senhaHashada;
    
                const usuarioF = {
                   usuario: nomeFormatado,
                   ...usuario,
                }

                const sql = format('INSERT INTO registrodeponto.Usuarios ?', usuarioF);
    
                // const sql = 'INSERT INTO registrodeponto.Usuarios (usuario, nome, senha, email, cargo) VALUES (' + `'` + [usuarioF.usuario, usuarioF.nome, usuarioF.senha, usuarioF.email, usuarioF.cargo ].join(`','`) + `'` + ')';

                conexao.query(sql, (erro, resultados) => {
                    if(erro){
                        res.status(400).json(erro);
                    }else{
                        res.status(201).json(usuarioF)
                    }
                })

            });

        }
    }

    lista(res) {
        const sql = "SELECT * FROM registrodeponto.Usuarios";

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
        const sql = `SELECT * FROM registrodeponto.Usuarios WHERE id_usuario=$1`;

        conexao.query(sql, [id], (erro, resultados) => {
            // const usuario = resultados[0]
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(...resultados.rows);
            }
        })
    }

    altera(id, valores, res) {

        const sql = format(`UPDATE registrodeponto.Usuarios SET ? WHERE id_usuario=${id}`, valores);

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json({...valores, id});
            }
        })
    }

    deleta(id, res) {
        const sql = `DELETE FROM registrodeponto.Usuarios WHERE id_usuario=${id}`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro.message);
            } else {
                res.status(201).json({id});
            }
        })
    }

}

module.exports = new Usuario;