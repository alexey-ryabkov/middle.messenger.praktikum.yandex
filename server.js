const express = require('express');
const fs = require('fs');

const DEFAULT_PAGE = '/error404/';
const DEFAULT_PORT = 3000;

const app = express();

app.use(express.static(`${__dirname}/dist`));

fs.readdirSync(`${__dirname}/src/pages/`).forEach(page => app.use(`/${page}`, express.static(`${__dirname}/dist`)));

app.use('/', function(req, res) 
{
    res.redirect(DEFAULT_PAGE);
});

const appPort = process.env.PORT || DEFAULT_PORT;
app.listen(appPort, () => 
{
    console.log(`Сервер для ${__dirname} запущен на localhost:${appPort}!`);
});
