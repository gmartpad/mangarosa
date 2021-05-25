const customExpress = require('./config/customExpress')

// initializando a utilização de variáveis de ambiente
require('dotenv').config();

// instanciando o servidor com as configs customizadas
const app = customExpress();

// porta no qual o servidor estará escutando
const port = process.env.PORT;

// O servidor estará rodando e escutando na porta 5000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});