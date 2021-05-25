class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        console.log('Tabelas foram chamadas')
    
        this.criarUsuarios();
        this.criarRegistros();
    }

    criarUsuarios() {
        const sql = `CREATE TABLE IF NOT EXISTS Usuarios (id int NOT NULL AUTO_INCREMENT, usuario varchar(100) NOT NULL, nome varchar(100) NOT NULL, senha char(60) NOT NULL, email varchar(100) NOT NULL, cargo char(1) NOT NULL, PRIMARY KEY(id))`;

        this.conexao.query(sql, err => {
            if(err) {
                console.log(`Houve falha na execução do SQL de criação da tabela Usuarios`);
            } else {
                console.log(`Criação da tabela Usuarios realizada com sucesso!`);
            }
        })  
    }

    criarRegistros() {
        const sql = `CREATE TABLE IF NOT EXISTS Registros (id int NOT NULL AUTO_INCREMENT, idNRegistroUsuario int NOT NULL, usuario varchar(100), nome varchar(100) NOT NULL, email varchar(100) NOT NULL, cpf char(14) NOT NULL, celular varchar(11), conhecimentos varchar(40), dateTimeRegistro datetime NOT NULL, validado char(1) NOT NULL DEFAULT 'N', dateTimeValidacao datetime, PRIMARY KEY(id), FOREIGN KEY (usuario) REFERENCES Usuarios(usuario))`;

        this.conexao.query(sql, err => {
            if(err) {
                console.log(`Houve falha na execução no SQL de criação da tabela Registros`);
            } else {
                console.log(`Criação da tabela Registros realizada com sucesso!`);
            }
        })
    }
}

module.exports = new Tabelas;