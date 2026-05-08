import { Request, Response, NextFunction } from "express"

export function errorHandler(err:any, req:Request, res:Response, next:NextFunction) {
    if (!err.isOperational) {
        console.error('ERROR NO OPERACIONAL:', {
            message: err.message,
            stack: err.stack,
            originalError: err.originalError
        })
    }

    //----PRODUCCION-----
    // if (!err.isOperational) {
    //     logger.error('ERROR NO OPERACIONAL:', {
    //         message: err.message,
    //         stack: err.stack,
    //         url: req.originalUrl,
    //         method: req.method,
    //         userId: req.user?.id,
    //         timestamp: new Date().toISOString()
    //     });
    // }


    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                ...(err.resource && { resource: err.resource }),
                ...(err.details && { details: err.details })
            }
        })
    }

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Error interno del servidor'
        }
    })
}