import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import userService from '../services/user-service.js';
import tokenService from '../services/token-service.js';
import bcrypt from 'bcrypt';
import AdminRequestModel from '../models/AdminRequestModel.js';
import { v4 as uuidv4 } from 'uuid';
import mailService from '../services/mail-service.js';
import dotenv from 'dotenv'; 32
dotenv.config();

const API_URL = process.env.API_URL
const CLIENT_URL = process.env.CLIENT_URL
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET


export const register = async (req, res, next) => {
    try {
        const { email, fullName, password, avatarUrl } = req.body;
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            return res.status(400).json({ message: `Email ${email} is already taken` });
        }
        const userData = await userService.register(email, fullName, password, avatarUrl);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json(userData);
    } catch (error) {
        console.log('register error', error);
        res.status(500).json({
            message: 'Cannot register'
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: `account with email ${email} doesnt exist` });
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: 'неверный логин или пароль' })
        }
        const userData = await userService.login(user);
        res.cookie('refreshToken', userData.refreshToken,
            { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.json(userData);
    } catch (error) {
        console.log('login error', error);
        res.status(500).json({
            message: 'Cannot login'
        })
    }
}

export const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect('https://spboptis.ru/')
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'can not activate',
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        const candidate = await UserModel.findOne({ email })
        if (!candidate) {
            return res.status(400).json({ message: `Пользователь с таким email ${email} не зарегистрирован` });
        }
        const resetLink = uuidv4();
        await UserModel.updateOne({ email },
            { resetPasswordLink: resetLink })
        await mailService.sendForgotPasswordMail(email, `${API_URL}/auth/forgotpassword/${resetLink}`)

        res.json({
            message: 'Ссылка для сброса пароля направлена на email. Торопитесь, она действительна только 15 минут.',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'ошибка сброса пароля',
        })
    }
}

export const forgotPasswordLink = async (req, res) => {
    try {
        const resetPasswordLink = req.params.link;
        const user = await UserModel.findOne({ resetPasswordLink })
        if (!user) {
            return res.status(404).json({
                message: 'Некорректная ссылка',
            });
        }
        user.allowedToResetPassword = true
        await user.save()
        return res.redirect(`${CLIENT_URL}/auth/setnewpassword`)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'can not activate',
        })
    }
}


export const setNewPassword = async (req, res) => {
    try {
        const email = req.body.email
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: `Пользователь с таким email ${email} не зарегистрирован` });
        }
        const newPassword = req.body.newPassword
        const salt = await bcrypt.genSalt(3)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        if (user.allowedToResetPassword) {
            await UserModel.updateOne({ email },
                { resetPasswordLink: '', password: hashPassword, allowedToResetPassword: false },
                { returnDocument: 'after' })
            const tokensPayload = { email: user.email, id: user.id, isActivated: user.isActivated };
            const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
            const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, { expiresIn: '180d' });
            const tokens = { accessToken, refreshToken };
            await tokenService.saveToken(tokensPayload.id, tokens.refreshToken)
            res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
            res.json({ user, message: 'пароль успешно изменён' })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'ошибка изменения пароля',
        })
    }
}



















export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const getOneUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            })
        }
        res.json(user)
    } catch (error) {
        console.log(error)
    }
}


export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token)
    } catch (error) {
        console.log('logout error', error);
        res.status(500).json({
            message: 'Cannot logout'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            })
        }
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            'secret123',
            { expiresIn: '30d', },
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'no access',
        });
    }
}

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = jwt.verify(refreshToken, 'jwt-refresh-secret-key');
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!refreshToken || !userData || !tokenFromDB) {
            return res.status(401).json({ message: `no token or smthing` });
        }
        const user = await UserModel.findById(userData.id);
        const userPayload = { email: user.email, id: user.id, isActivated: user.isActivated };
        const tokens = tokenService.generateTokens({ ...userPayload });
        await tokenService.saveToken(userPayload.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        return res.json({ user, tokens });

    } catch (error) {
        console.log('refresh error', error)
        return res.status(500).json({
            message: 'Cannot refresh'
        })
    }
}


export const addToFavorites = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const user = await UserModel.findById(req.user.id);
        user.favourites.push(productId);
        await user.save();
        const result = user.favourites;
        return res.json(result)
    } catch (error) {
        console.log('addToFavorites error', error)
        return res.status(500).json({
            message: 'Cannot add To Favorites'
        })
    }
}
export const removeFromFavorites = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const user = await UserModel.findById(req.user.id);
        user.favourites = user.favourites.filter(el => el !== productId);
        await user.save();
        const result = user.favourites;
        return res.json(result)
    } catch (error) {
        console.log('removeFromFavorites error', error)
        res.status(500).json({
            message: 'Cannot remove From Favorites'
        })

    }
}

export const addEyewearToCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const user = await UserModel.findById(req.user.id);
        const good = user.cart.find(elem => elem.productId === productId)
        if (good) {
            good.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1, leftLens: req.body.lens, rightLens: req.body.lens, cat: req.body.cat });
        }
        await user.save();
        const result = user.cart;
        return res.json(result)
    } catch (error) {
        console.log('addToFavorites error', error)
        return res.status(500).json({
            message: 'Cannot add To Cart'
        })
    }
}


export const editCart = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        user.cart = req.body;
        await user.save();
        const result = user.cart;
        return res.json(result)
    } catch (error) {
        console.log('addToFavorites error', error)
        return res.status(500).json({
            message: 'Cannot add To Cart'
        })
    }
}

export const removeEyewearFromCart = async (req, res) => {
    try {
        const id = req.body.productId;
        const user = await UserModel.findById(req.user.id);
        const renewedCart = user.cart.filter(el => el.productId !== id)
        const renewedUser = await UserModel.findByIdAndUpdate({ _id: req.user.id }, {
            cart: renewedCart,
        },
            { returnDocument: 'after', },);


        const result = renewedUser.cart;
        return res.json(result)
    } catch (error) {
        console.log('removeFromFavorites error', error)
        res.status(500).json({
            message: 'Cannot remove From Cart'
        })
    }
}


export const adminRoleRequest = async (req, res) => {
    try {
        const newRequest = await AdminRequestModel.create({
            email: req.body.email,
            fullName: req.body.fullName,
            isAnswered: false,
            role: req.body.role,
        })
        return res.json(newRequest)
    } catch (error) {
        console.log('admin request error', error)
        res.status(500).json({
            message: 'Cannot send request'
        })
    }
}


export const editUserAvatar = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        user.avatarUrl = req.body.url;
        await user.save();
        const url = user.avatarUrl;
        return res.json({ url })
    } catch (error) {
        console.log('edit user avatar error', error)
        return res.status(500).json({
            message: 'Cannot edit avatar'
        })
    }
}

export const editUserFullName = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        user.fullName = req.body.fullName;
        await user.save();
        const fullName = user.fullName;
        return res.json({ fullName })
    } catch (error) {
        console.log('edit user name error', error)
        return res.status(500).json({
            message: 'Cannot edit name'
        })
    }
}
