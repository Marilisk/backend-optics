import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
//import { validationResult } from 'express-validator';
import UserModel from '../models/UserModel.js';

export const register = async (req, res) => {
    try {
        
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            isManager: req.body.isManager,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign(
            { _id: user._id, },
            'secret123',
            { expiresIn: '30d', },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.status(404).json({
                message: 'Вы уже зарегистрированы',
            })
        } else {
            res.status(500).json({
                message: 'can not register',
            });
        } 
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        };
        const isPassValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isPassValid) {
            return res.status(404).json({
                message: 'неверный логин или пароль',
            })
        };

        const token = jwt.sign(
            { _id: user._id, },
            'secret123',
            { expiresIn: '30d', },
        );
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'can not login',
        });
    }
}

export const getMe = async(req, res)=> {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            })
        }
        const token = jwt.sign(
            { _id: user._id, },
            'secret123',
            { expiresIn: '30d', },
        );

        const{passwordHash, ...userData} = user._doc; 
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
