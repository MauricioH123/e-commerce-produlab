import { AppError } from "./AppError.js";

export class InactiveUserError extends AppError {
    constructor(message = 'Usuario inactivo') {
        super(message, 403)
    }
}