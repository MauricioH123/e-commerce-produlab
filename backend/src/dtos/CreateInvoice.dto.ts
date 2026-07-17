export type Invoice = {
    id: number,
    purchase_date: string,
    total: number,
    subtotal: number,
    tax: number,
    state: string,
}

export type InvoidInvoice = {
    invoices: Invoice[],
    total: number,
    page: number,
    totalPages: number
}