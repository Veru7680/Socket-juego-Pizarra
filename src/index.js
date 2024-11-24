const express = require('express');
const path =require('path');
const socketIO =require('socket.io');
const http = require('http');

//inicializar
const app = express();
const server = http.createServer(app);
const io= socketIO(server);
//configuracion
app.use(express.static(path.join(__dirname,'puclic')));

app.set('port', process.env.PORT || 3000);
//sockets
require('./sockets')(io);

server.listen(app.get('port'),()=>{
    console.log('server puerto 3000');
})

