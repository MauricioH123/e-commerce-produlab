import { ConflictError } from "../errors/ConflictError.js";
import { User } from "../models/user.js";

export class SoftDeleteUserService {

    static async execute({ id }:{id:number}) {

            const findUser = await User.findById({ id })

            if (!findUser.activo) {
                throw new ConflictError('El usuario ya está eliminado')
            }

            const userDelete = await User.delete({ id })

            return userDelete
    }

}