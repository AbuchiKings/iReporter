import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_KEY;


const auth = {

    verifyToken(req, res, next) {

        const access = req.headers.authorization
        if (!access) {
            return res.status(401).send({ status: 401, message: 'Headers not set' });
        }

        let bearerToken = access.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({
                    status: 401,
                    message: err.name
                })
                return;
            }
            req.user = decodedToken;
           return next();
        });

    }
}

export default auth;
