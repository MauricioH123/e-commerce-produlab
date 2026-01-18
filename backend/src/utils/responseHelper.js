export function successResponse(res, data, statusCode = 200, message = null) {
    const response = {
        success: true,
        data
    }

    if (message) {
        response.message = message
    }

    return res.status(statusCode).json(response)
}


export function createdResponse(res, data, message = 'Recurso creado exitosamente'){
    return successResponse(res, data, 201, message)
}

export function deletedResponse(res, data, message = 'Recurso eliminado exitosamente'){
    return successResponse(res, data, 200, message)
}