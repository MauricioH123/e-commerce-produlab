import { AppError } from "./AppError.js";

export class InvalidError extends AppError{
    constructor(message = 'Datos invalidos'){
        super(message, 400)
    }
}