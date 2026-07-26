import express, { json } from 'express';
import 'dotenv/config'
import { corsMiddleware } from './middlewares/cors.js';
import { usersRouter } from './routes/users.js';
import { swaggerDocs } from './config/swagger.js';
import { categoryRouter } from './routes/categories.js';
import { productsRouter } from './routes/products.js';
import { errorHandler } from './middlewares/errorHandler.js';
import './jobs/cleanIdempotencyKeys.js';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.js';


const PORT = process.env.PORT ?? 3000;

const app = express()

app.use(json())
app.use(corsMiddleware())
app.use(cookieParser());

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/categories', categoryRouter)
app.use('/products', productsRouter)

swaggerDocs(app)

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
    console.log('Swagger disponible en http://localhost:3000/api-docs')
})