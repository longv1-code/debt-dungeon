import { validationResult } from 'express-validator'

export const validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map((err: any) => ({
                field: err.path,
                message: err.msg
            }))
        })
    }

    next()
}