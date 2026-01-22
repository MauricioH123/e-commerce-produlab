import { AppError } from "./AppError.js";

export class DatabaseError extends AppError{
    constructor(message = 'Error en la base de datos', originalError = null){
        super(message, 500)
        this.originalError = originalError
    }

}