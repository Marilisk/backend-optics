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


export const postCreateValidator = [
    body('title', 'введите заголовок статьи больше 3 симв').isLength({min: 3 }).isString(),
    body('text', 'введите текст статьи больше 5 симв').isLength({min: 5}).isString(),
    body('tags', 'неверный формат тегов').isLength({min: 3}).optional().isString(),
    body('imageUrl', 'ссылка - не ссылка').optional().isArray(),   
];