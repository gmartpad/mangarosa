// requisição das lib
const express = require('express');
const consign = require('consign');
const session = require('express-session');
const cors = require('cors');

module.exports = () => {

    // instanciando o servidor
    const app = express();

    // habilitando leitura de corpos no formato json
    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(cors({
        origin: process.env.CLIENT_BASE_URL,
        optionsSuccessStatus: 200
    }))

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    // autocarregando os scripts
    consign()
        .include('controllers')
        .into(app);

    return app;

}