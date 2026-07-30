import { AppError } from "./AppError.js";

export class UnauthorizedUserError extends AppError {
    constructor(message = 'No tiene permisos') {
        super(message, 403)
    }
}