import cors from 'cors'

const ACCEPTED_ORIGINS: string[] = [
    'http://localhost:8080',
    'http://localhost:3000'
]

interface CorsMiddlewareOptions {
    accepted_origins?: string[]
}

export const corsMiddleware = ({accepted_origins = ACCEPTED_ORIGINS}: CorsMiddlewareOptions = {}) => cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || accepted_origins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}) 