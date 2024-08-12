const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500

    const message = err.message || "Backend Erro"

    const extraDetails = err.extraDetails || "Error from Backend"

    return res.status(status).json({message, extraDetails})
}

// errorHandler.js
// export const errorHandler = (err, req, res, next) => {
//     console.error(err.stack);
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         status: 'error',
//         statusCode,
//         message: err.message || 'Internal Server Error',
//     });
// };


export default errorHandler

