import dotenv from 'dotenv'; 
dotenv.config();

const BOOKING_SECRET = process.env.BOOKING_SECRET


export default (req, res, next) => {
    
    try {
        const authorisationHeader = req.headers.authorization;
        if (!authorisationHeader) {
            return res.status(401).json({message: `no secret`});
        }
        if (authorisationHeader !== BOOKING_SECRET ) {
            return res.status(401).json({message: `invalid secret`});
        }
        next();
    } catch (error) {
        throw new Error(401, 'No access' );
    }
}