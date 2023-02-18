import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import userService from '../services/user-service.js';
import tokenService from '../services/token-service.js';

export const register = async (req, res, next) => {
    try {
        const { email, fullName, password, avatarUrl } = req.body;
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
        const userData = await userService.login(email, password);
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
        return res.redirect('http://localhost:3000')

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'can not activate',
        });

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
        //console.log(req.body)
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
            user.cart.push({productId, quantity: 1, leftLens: req.body.lens, rightLens: req.body.lens, cat: req.body.cat });
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
