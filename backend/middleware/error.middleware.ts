export const errorHandler = (err, req, res, next) => { // handles error thrown anywhere in app
    console.error(err)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}