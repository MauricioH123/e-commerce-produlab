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
import helmet from 'helmet';
import { addresRouter } from './routes/address.js';
import { brandsRoute } from './routes/brands.js';
import { cartsRouter } from './routes/carts.js';
import { inventoryRouter } from './routes/inventory.js';


const PORT = process.env.PORT ?? 3000;

const app = express()

app.use(helmet())
app.use(json())
app.use(corsMiddleware())
app.use(cookieParser());

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/categories', categoryRouter)
app.use('/products', productsRouter)
app.use('/address', addresRouter)
app.use('/brands', brandsRoute)
app.use('/carts', cartsRouter)
app.use('/inventary', inventoryRouter)

swaggerDocs(app)

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
    console.log('Swagger disponible en http://localhost:3000/api-docs')
})