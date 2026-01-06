export function errorHandler(err, req, res, next){
    if(err.isOperational){
        return res.status(err.statusCode).json({
            error: err.message
        })
    }

    console.log(err)

    return res.status(500).json({
        error:"Error interno del servidor"
    })
}