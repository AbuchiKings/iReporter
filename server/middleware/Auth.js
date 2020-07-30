import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import errorHandler from './../utils/errorHandler';
import responseHandler from '../utils/responseHandler';


dotenv.config();
const SECRET = process.env.JWT_KEY;


const auth = {

    verifyToken(req, res, next) {
        const access = req.headers.authorization;
        let token;
        if (access) {
            let bearerToken = access.split(' ');
            token = bearerToken[1];

        } else if (request.cookies.jwt) {
            token = request.cookies.jwt;
        }

        if (!token) return errorHandler(401, 'Unauthorised. Please login with your details');

        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) return next(error);
            req.user = decodedToken;
            return next();
        });
    },

    signToken: async (req, res, next) => {
        try {
            const { id, email, is_admin, is_verified } = req.user;
            const token = jwt.sign({ id, email, is_admin, is_verified }, SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIMEFRAME });
            req.token = token;
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    addToken(req, res, next) {
        const token = req.token;
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_EXPIRY_TIME * 1000 * 60 * 60 * 24)
        }
        cookieOptions.secure = req.secure || req.headers['x-forwarded-proto'] === 'https';

        if (process.env.NODE_ENV === 'production' && !cookieOptions.secure) {
            return errorHandler(401, 'You cannot be logged in when your network connection is not secure!');
        }

        res.cookie('jwt', token, cookieOptions);
        return responseHandler(res, [token, req.user], next, 200, 'Successfully logged in', 1);
    }
}

export default auth;
