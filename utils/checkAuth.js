//import jwt from 'jsonwebtoken';
import TokenService from '../services/token-service.js';

export default (req, res, next) => {
    //const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new Error('no authorizationHeader')
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            throw new Error('no accessToken')
        }

        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData) {
            throw new Error('no userData')
        }
        req.user = userData;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'No access',
        })
    }

}