import { ConflictError } from "../errors/ConflictError.js";
import { User } from "../models/usuario.js";

export class SoftDeleteUserService {

    static async execute({ id }) {

            const findUser = await User.findById({ id })

            if (!findUser.activo) {
                throw new ConflictError('El usuario ya está eliminado')
            }

            const userDelete = await User.delete({ id })

            return userDelete
    }

}