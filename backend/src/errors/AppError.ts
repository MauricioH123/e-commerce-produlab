export class AppError extends Error{
    statusCode: number
    details: any
    isOperational: boolean
    constructor(message: string, statusCode: number, details = null){
        super(message)
        this.statusCode = statusCode
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}