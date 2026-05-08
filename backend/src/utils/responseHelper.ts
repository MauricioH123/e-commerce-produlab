import { Response } from "express"

type SuccessResponse = {
    success: boolean,
    data: any,
    message?: string
}

type SuccessResponseParams = {
    res: Response,
    data?: any,
    statusCode?: number,
    message?: string
}

export function successResponse({ res, data, statusCode = 200, message }: SuccessResponseParams) {
    const response: SuccessResponse = {
        success: true,
        data,
    }

    if (message) {
        response.message = message
    }

    return res.status(statusCode).json(response)
}


export function createdResponse({ res, data, message = 'Recurso creado exitosamente' }: Omit<SuccessResponseParams, 'statusCode'>) {
    return successResponse({ res, data, statusCode: 201, message })
}

export function deletedResponse({ res, message = 'Recurso eliminado exitosamente' }: Omit<SuccessResponseParams, 'statusCode' | 'data'>) {
    return successResponse({ res, statusCode: 200, message })
}