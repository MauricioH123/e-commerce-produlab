import express, { json } from 'express';
import 'dotenv/config'
import { corsMiddleware } from './middlewares/cors.js';
import { usuariosRouter } from './routes/usuarios.js';


const PORT = process.env.PORT ?? 3000;

const app = express()

app.use(json())
app.use(corsMiddleware())

app.use('/usuarios', usuariosRouter)

app.listen(3000, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})