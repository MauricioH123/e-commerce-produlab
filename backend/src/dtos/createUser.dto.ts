import { capitalizeWords } from "../utils/stringUtils.js";

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

export type TUser = {
    id: string,
    name: string,
    email: string,
    identification_number: number,
    password: string,
    identification: number,
    phone_number: string
}