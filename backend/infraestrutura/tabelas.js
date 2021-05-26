class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        console.log('Tabelas foram chamadas')
    
        this.criarUsuarios();
        this.criarRegistros();
    }

    criarUsuarios() {
        const sql = `CREATE TABLE IF NOT EXISTS registrodeponto.Usuarios (id_usuario int NOT NULL, usuario varchar(100) NOT NULL, nome varchar(100) NOT NULL, senha char(60) NOT NULL, email varchar(100) NOT NULL, cargo char(1) NOT NULL, PRIMARY KEY(id_usuario), UNIQUE(id_usuario))`;

        this.conexao.query(sql, err => {
            if(err) {
                console.log(`Houve falha na execução do SQL de criação da tabela Usuarios`);
                console.log(err);
            } else {
                console.log(`Criação da tabela Usuarios realizada com sucesso!`);
            }
        })  
    }

    criarRegistros() {
        const sql = `CREATE TABLE IF NOT EXISTS registrodeponto.Registros (id_registro int NOT NULL, idNRegistroUsuario int NOT NULL, usuario int, nome varchar(100) NOT NULL, email varchar(100) NOT NULL, cpf char(14) NOT NULL, celular varchar(11), conhecimentos varchar(40), dateTimeRegistro timestamp NOT NULL, validado char(1) NOT NULL DEFAULT 'N', dateTimeValidacao timestamp, PRIMARY KEY(id_registro), UNIQUE(id_registro), UNIQUE(cpf), CONSTRAINT fk_usuario FOREIGN KEY (usuario) REFERENCES registrodeponto.Usuarios(id_usuario))`;

        this.conexao.query(sql, err => {
            if(err) {
                console.log(`Houve falha na execução no SQL de criação da tabela Registros`);
                console.log(err);
            } else {
                console.log(`Criação da tabela Registros realizada com sucesso!`);
            }
        })
    }
}

module.exports = new Tabelas;