import { AppError } from "./AppError.js";

export class NotFoundError extends AppError{
    constructor(resource = 'Recurso'){
        super(`${resource} no encontrado`, 404)
        this.resource = resource
    }
}