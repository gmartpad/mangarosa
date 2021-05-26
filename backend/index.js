require('dotenv').config();

const customExpress = require('./config/customExpress')
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

// initializando a utilização de variáveis de ambiente

conexao.connect(err => {

    if(err) {

        console.log(err)

    } else {


        console.log(`Conexão ao banco de dados realizada com sucesso!`)

        Tabelas.init(conexao);

        // instanciando o servidor com as configs customizadas
        const app = customExpress();

        // porta no qual o servidor estará escutando
        const port = process.env.PORT;

        // O servidor estará rodando e escutando na porta 5000
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });

    }
    
})