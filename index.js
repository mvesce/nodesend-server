const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear servidor
const app = express();

//Conectar a la bd
conectarDB();

//Habilitar CORs
const opcionesCors = {
  origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));

console.log('Comenzando nodesend...');

//Puerto APP
const port = process.env.PORT || 4000;

//Habilitar leer valores de un body
app.use(express.json());

//Habilitar carpeta pública
app.use( express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Inicializar app
app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor está funcionando en el puerto ${port}`);
})