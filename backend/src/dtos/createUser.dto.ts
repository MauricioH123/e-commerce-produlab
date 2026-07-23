import { capitalizeWords, removeSpaces } from "../utils/stringUtils.js";

export type UserWithOrders = {
    id: number,
    name: string,
    rol: string,
    state: boolean,
    number_of_orders: string
}

export type UsersPage = {
    users: UserWithOrders[],
    total: number,
    page: number,
    totalPages: number
}

export type TAddress = {
    id: number,
    neighborhood: string,
    address_line: string,
    is_main: boolean,
    user_id: string,
    department_id: number,
    municipality_id: number,
    instructions: string | null
}

export type TUser = {
    id: string,
    name: string,
    email: string,
    identification_number: string,
    password: string,
    identification_id: number,
    rol_id: number,
    state: boolean,
    phone_number: string,
    addresses: TAddress[]
}

export type UserProfile = {
    name: string,
    email: string,
    identification_number: string,
    rol: string,
    state: boolean,
    identification: string
}

export type createAddressDTO = Omit<TAddress, 'id' | 'user_id' | 'is_main'>

export type CreateUserDTO = Omit<TUser, 'id' | 'addresses' | 'rol_id' | 'state'> & { address: createAddressDTO }

export function createUserDTO(object: CreateUserDTO): CreateUserDTO {
    return {
        name: capitalizeWords(object.name),
        email: object.email.toLowerCase(),
        identification_number: object.identification_number,
        password: object.password,
        identification_id: object.identification_id,
        phone_number: removeSpaces(object.phone_number),
        address: {
            neighborhood: capitalizeWords(object.address.neighborhood),
            address_line: capitalizeWords(object.address.address_line),
            department_id: object.address.department_id,
            municipality_id: object.address.municipality_id,
            instructions: object.address.instructions ? capitalizeWords(object.address.instructions): null
        }
    }
}
