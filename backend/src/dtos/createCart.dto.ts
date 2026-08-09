export type CartItem = {
    id: number,
    product_id: number,
    name: string,
    image_url: string
    amount: number,
    price: number
}

export type UpdateCartItem = {
    id: number,
    product_id: number,
    amount: number
}

export type InsertItemIntoCart = {
    product_id: number,
    amount: number
}

