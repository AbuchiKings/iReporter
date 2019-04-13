import 'babel-polyfill';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import responseHandler from '../middleware/responseHandler';

dotenv.config();
const SECRET = process.env.JWT_KEY;

const auth = {

    async veryfyToken(req, next) {
        try {
            const autho = req.headers.authorization;
            if (!autho) responseHandler.handleError(401, 'Unauthorised access');

            const token = auth.split(' ');
            const decodedToken = await jwt.verify(token, SECRET);
            req.user = decodedToken;
           
            next()

        } catch (error) {
            return responseHandler.handleError(401, error.name);
        }
    }

}
export default auth;
