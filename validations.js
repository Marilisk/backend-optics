import { body } from 'express-validator';

export const loginValidator = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'длина пароля д б не менее 5 симв').isLength({min: 5}),
];

export const registerValidator = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'длина пароля д б не менее 5 симв').isLength({min: 5}),
    body('fullName', 'длина имени д б не менее 3 симв').isLength({min: 3}),
    body('avatarUrl', 'ссылка - не ссылка').isURL().optional(),   //аватар опционален, но если все же придёт, надо провенить является ли ссылкой
];


export const productCreateValidator = [
    body('name', 'введите название продукта больше 3 симв').isLength({min: 3 }).isString(),
    body('description', 'введите описание продукта больше 5 симв').isLength({min: 5}).isString(),
    body('price', 'введите цену продукта больше 0').exists(),
    body('features', 'неверный формат тегов').optional().isArray(),
    body('options', 'неверный формат опций').optional().isArray(),   
];