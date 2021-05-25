// requisição das lib
const express = require('express');
const consign = require('consign');

module.exports = () => {

    // instanciando o servidor
    const app = express();

    // habilitando leitura de corpos no formato json
    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    // autocarregando os scripts
    consign()
        .include('controllers')
        .into(app);

    return app;

}