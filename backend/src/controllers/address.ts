import { Request, Response, NextFunction } from "express"

export class Address {

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const id_address = Number(req.query.id)
        
    }


}