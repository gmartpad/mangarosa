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

        const cpfEhValido = /[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}/.test(usuario.cpf);

        const validacoes = [
            {
                nome: 'nome',
                valido: nomeEhValido,
                mensagem: 'O nome do usuário tem de possuir no mínimo 5 caracteres'
            },
            {
                nome: 'email',
                valido: emailEhValido,
                mensagem: 'O email não é um email válido. Ex: fulano@mail.com'
            },
            {
                nome: 'cpf',
                valido: cpfEhValido,
                mensagem: 'O cpf não está no formato válido. Ex: 123.456.789-01'
            },
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

                const sqlCpf = `SELECT COUNT(*) FROM registrodeponto.Usuarios WHERE cpf = '${usuarioF.cpf}'`;
            
                conexao.query(sqlCpf, (erro, resultados) => {
                
                    if(erro){
                        res.status(400).json(erro)
                    } else {
                        
                        if(parseInt(resultados.rows[0].count) != 0){
                            
                            res.status(400).json({
                                nome: 'cpf',
                                mensagem: 'Este cpf já está cadastrado.'
                            })
                            
                        } else {

                            const sql = format('INSERT INTO registrodeponto.Usuarios ?', usuarioF);
                
                            conexao.query(sql, (erro, resultados) => {
                                if(erro){
                                    res.status(400).json(erro);
                                }else{
                                    res.status(201).json(usuarioF)
                                }
                            })
                        }

                    }

                });


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
                    res.status(200).json(resultados.rows)
                } else {
                    res.status(200).json(...resultados.rows)
                }
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM registrodeponto.Usuarios WHERE id_usuario=$1`;

        conexao.query(sql, [id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(...resultados.rows);
            }
        })
    }

    altera(id, valores, res) {

        const sql = format(`UPDATE registrodeponto.Usuarios SET ? WHERE id_usuario=${id}`, valores);

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({...valores, id});
            }
        })
    }

    deleta(id, res) {
        const sql = `DELETE FROM registrodeponto.Usuarios WHERE id_usuario=${id}`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro.message);
            } else {
                res.status(200).json({id});
            }
        })
    }

}

module.exports = new Usuario;