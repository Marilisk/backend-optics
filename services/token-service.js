import TokenModel from "../models/TokenModel.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '180d'})
        return { accessToken, refreshToken }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET )
            return userData;
        } catch (error) {
            return null; 
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET).tokensPayload;
            return userData;
        } catch (error) {
            return null; 
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        //console.log(refreshToken);
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData;
    }
}

export default new TokenService();