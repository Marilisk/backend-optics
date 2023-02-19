import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken";

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
        const accessToken = jwt.sign(tokensPayload, 'jwt-secret-key', {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, 'jwt-refresh-secret-key', {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};
        await tokenService.saveToken(tokensPayload.id, tokens.refreshToken);
        return { ...tokens, user }
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

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            return res.status(400).json({message: `account with email ${email} doesnt exist`});
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({message: 'неверный логин или пароль'})
        }
        const tokensPayload = {email: user.email, id: user.id, isActivated: user.isActivated};
        const accessToken = jwt.sign(tokensPayload, 'jwt-secret-key', {expiresIn: '15m'})
        const refreshToken = jwt.sign(tokensPayload, 'jwt-refresh-secret-key', {expiresIn: '180d'});
        const tokens = {accessToken, refreshToken};

        await tokenService.saveToken(user.id, refreshToken);
        return { ...tokens, user }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

}


export default new UserService();