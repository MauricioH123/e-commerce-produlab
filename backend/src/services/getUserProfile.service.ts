import { Address } from "../models/address.js";
import { User } from "../models/user.js";


export class GetUserProfile {

    static async execute({ id }:{id:number}) {

        const user = await User.findById({ id })

        const address = await Address.getByUserId({ id })

        const result = {
            nombre: user.nombre,
            correo: user.correo,
            numero_identificacion: user.numero_identificacion,
            activo: user.activo,
            tipo_identificacion: user.tipo_identificacion,
            numero_celular: user.numero_celular,
            direcciones: address
        }

        return result
    }
}