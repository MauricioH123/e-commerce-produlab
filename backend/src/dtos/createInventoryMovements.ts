export const OPERATIONS = {
    addition: 1,
    subtraction: 0
} as const

export type MovementType = typeof OPERATIONS[keyof typeof OPERATIONS]

export type createMovementAdmin = {
    product_id: number,
    type: MovementType,
    amount: number,
    reason?: string,
}