import { AppError } from "./AppError.js";

export class InvalidCredentialsError extends AppError {
    constructor(message = 'Credenciales invalidas') {
        super(message, 401)
    }
}