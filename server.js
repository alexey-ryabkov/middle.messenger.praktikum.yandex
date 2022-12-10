import express from 'express';

const APP_NAME = 'Sur Chat';
const BUILD_FOLDER = '/dist';
const DEFAULT_PORT = 3000;

const app = express();

app.use( express.static(`${__dirname}${BUILD_FOLDER}`) );
app.use('/', function({ res }) 
{
    res.sendFile( `${__dirname}/dist/index.html` );
});

const appPort = process.env.PORT || DEFAULT_PORT;
app.listen(appPort, () => 
{
    console.log( `Сервер для ${APP_NAME} запущен на localhost:${appPort}!` );
});
