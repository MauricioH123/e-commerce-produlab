import pg from 'pg'
import dotenv from 'dotenv'

const { Pool, Client } = pg

dotenv.config()

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})