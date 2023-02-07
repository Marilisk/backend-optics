import { validationResult } from "express-validator";

export default (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('i m in handleval Errors !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        return res.status(400).json(errors.array());
    }

    next();
}