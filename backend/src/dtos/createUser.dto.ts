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