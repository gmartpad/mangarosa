const customExpress = require('./config/customExpress')

// instanciando o servidor com as configs customizadas
const app = customExpress();

// porta no qual o servidor estará escutando
const port = 5000;

// O servidor estará rodando e escutando na porta 5000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});