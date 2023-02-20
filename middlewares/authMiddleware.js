import tokenService from '../services/token-service.js';


export default (req, res, next) => {
    
    try {
        const authorisationHeader = req.headers.authorization;
        if (!authorisationHeader) {
            return res.status(401).json({message: `no authorisationHeader`});
        }
        const accessToken = authorisationHeader.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({message: `no accessToken`});
        }
        const userData = tokenService.validateAccessToken(accessToken);
        
        if (!userData) {
            return res.status(401).json({message: `no userData`});
        }
        req.user = userData;
        next();
    } catch (error) {
        throw new Error(401, 'User s not authorised' );
    }
}