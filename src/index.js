const express = require('express');
const path =require('path')
//inicializar
const app = express();

//configuracion
app.use(express.static(path.join(__dirname,'puclic')));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'),()=>{
    console.log('server puerto 3000');
})