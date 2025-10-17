import {pool} from "../config/database.js";


export class Product {
    static async getAll({input}) {

        const columnName = Object.keys(input)
        const columnNameModificate = columnName.map(col => `${col} = ? `).join(', ')

        const query = `SELECT nombre, foto, precio, iva FROM `
    }
}