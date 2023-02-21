import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

class UserService {

    async register(email, fullName, password, avatarUrl) {
        const salt = await bcrypt.genSalt(3)
        const hashPassword = await bcrypt.hash(password, salt)
        const activationLink = uuidv4();
        const user = await UserModel.create({ email, 
                                             fullName, 
                                             password: hashPassword, 
                                             activationLink, 
                                             role: 'USER', 
                                             avatarUrl})
        await mailService.sendActivationMail(email, `https://backend-optics-production.up.railway.app/${activationLink}`);
        const tokensPayload = {email: user.email, id: user.id, isActivated: user.isActivated};
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};
        await tokenService.saveToken(tokensPayload.id, tokens.refreshToken);
        return { ...tokens, user }
    }

    async login(user) {
        const tokensPayload = {email: user.email, id: user.id, isActivated: user.isActivated, role: user.role};
        const accessToken = jwt.sign(tokensPayload, JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, JWT_REFRESH_SECRET, {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};
        await tokenService.saveToken(user.id, refreshToken);
        return { ...tokens, user }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user) {
            return res.status(404).json({
                message: 'Incorrect authorisation link',
            });
        }
        user.isActivated = true;
        await user.save()
    }

}


export default new UserService();