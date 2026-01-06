import { AppError } from "./AppError.js";

export class ConflictError extends AppError{
    constructor(message = 'Conflicto de datos'){
        super(message, 409)
    }
}