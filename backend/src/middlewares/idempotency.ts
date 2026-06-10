import { NextFunction, Request, Response } from "express";
import { InvalidError } from "../errors/InvalidError.js";
import { pool } from "../config/database.js";
import { populate } from "dotenv";

export async function idempotency(req: Request, res: Response, next: NextFunction) {
    const idempotencyKey = req.headers['idempotency-key'] as string
    const url = req.originalUrl

    if (!idempotencyKey) {
        return next(new InvalidError('se requiere idempotency-key', ''))
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    if (!uuidRegex.test(idempotencyKey)) {
        return next(new InvalidError('El idempotency-key debe ser un UUID valido', ''))
    }

    try {
        const existing = await pool.query('SELECT response_json, status_code FROM public.idempotency_keys WHERE id = $1;', [idempotencyKey])

        if (existing.rows.length > 0) {
            const cached = existing.rows[0]
            const code = Number(cached.status_code)

            console.log(cached.response_json)
            console.log(typeof cached.response_json)
            return res.status(code).json(cached.response_json)
        }

        await pool.query('INSERT INTO public.idempotency_keys (id, endpoint, status_code, created_at) VALUES($1, $2, 102, CURRENT_DATE);', [idempotencyKey, url])

        const originalJson = res.json.bind(res)

        res.json = (body: any) => {
            pool.query('UPDATE public.idempotency_keys SET response_json = $1, status_code = $2 WHERE id = $3;', [JSON.stringify(body), res.statusCode, idempotencyKey]).catch(console.error)

            return originalJson(body)
        }

        next()
    } catch (e) {
        next(e)
    }
}