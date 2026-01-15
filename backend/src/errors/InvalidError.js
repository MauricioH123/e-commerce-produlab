import { AppError } from "./AppError.js";

export class InvalidError extends AppError{
    constructor(message = 'Datos invalidos', details){
        super(message, 400, details)
    }
}