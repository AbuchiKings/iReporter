import 'core-js/stable';
import 'regenerator-runtime';
import Helper from '../helper/authHelper';
import formidable from 'formidable';
import query from '../queries/dbqueries';
import pool from '../queries/pool';
import { relative, join, resolve } from 'path'
import responseHandler from '../utils/responseHandler';
import errorHandler from './../utils/errorHandler';
import auth from './../middleware/Auth';
import crypto from 'crypto';


function errorMessage(msg) {
    const reg = /users_phone_number_key|users_username_key|users_email_key/;
    const duplicateMessages = {
        "users_email_key": "Email is already in use",
        "users_phone_number_key": "Phone number is already in use",
        "users_username_key": "Username is  already in use"
    }
    const message = duplicateMessages[msg.match(reg)[0]];
    return message ? message : undefined;
}
function checkError(error, next) {
    if (error.code == 23505) {
        const err = new Error();
        err.statusCode = 409;
        err.status = 'error';
        err.message = errorMessage(error.message);
        return next(err);
    } else {
        return next(error);
    }
}
function createResetToken() {

}

class UserController {

    static async createUser(req, res, next) {
        try {
            const { firstname, lastname, email, password, confirmPassword, username, phoneNumber, admin_code } = req.body;
            if (confirmPassword !== password) errorHandler(422, 'Passwords do not match');

            let isAdmin = process.env.ADMIN_CODE === admin_code ? true : false;
            const hashpassword = await auth.hashPassword(password);
            const registered = new Date();

            const user = await pool.query(query.regUser(firstname, lastname, email, phoneNumber, username.toLowerCase(), hashpassword, isAdmin, registered))
            const result = user.rows[0];
            result.password = '';

            return responseHandler(res, result, next, 201, 'Account was successfully created', 1);
            //later add a code for email or phone verification
        } catch (error) {
            console.log(error);
            return checkError(error, next);
        }
    }

    static async login(req, res, next) {
        try {
            const { username, email, password } = req.body;
            let result;
            if (username) {
                result = await pool.query(query.getUserByusername(username));
            }
            else if (email) {
                result = await pool.query(query.getUserByEmail(email));
            }
            if (!result.rows[0]) return errorHandler(404, 'Email or password is incorrect');

            const user = result.rows[0];
            //const validPassword = await bcrypt.compare(password, user.password);
            const validPassword = await auth.isPassword(password, user.password);

            if (!validPassword) return errorHandler(404, 'Email or password is incorrect');
            user.password = '';
            req.user = user;
            return next();
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    static async updateUser(req, res, next) {
        try {

            const userId = parseInt(req.params.id, 10);
            const { email, phoneNumber, username, firstname, lastname } = req.body;

            const foundUser = await pool.query(query.getUserById(userId));
            if (!foundUser.rows[0]) return errorHandler(404, 'Account was not found');

            const user = await pool.query(query.updateUser(email, phoneNumber, username, firstname, lastname, userId));
            user.rows[0].password = '';
            req.user = user.rows[0]
            req.message = 'Account was successfully updated';
            return next();
        } catch (error) {
            console.log(error)
            return checkError(error, next);
        }
    }

    static async updatePassword(req, res, next) {
        try {
            const result = await pool.query(`SELECT * FROM myireportdb.users WHERE reset_code = ${res}`);
            switch (result) {

                case 'invalidPassword':
                    return res.status(401).json({ status: 401, message: 'Invalid password' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
            }
            return res.status(201).json({
                status: 201,
                data: [result],
                message: 'Password updated'

            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            const user = await pool.query(query.getUserByEmail(email))
            if (!user.rows[0]) return errorHandler(404, 'Account not found.');

            let resetToken = crypto.randomBytes(3).toString('hex');
            const reset_code = crypto.createHash('sha256').update(resetToken).digest('hex');
            const reset_expires = new Date(Date.now() + (1000 * 60 * 5));

            await pool.query(query.saveResetCode(reset_code, reset_expires, email))

            // send code to email or phoneNumber
            // await client.messages.create({
            //     to: user.rows[0].phone_number,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     body: `Your password reset code is ${resetToken}. Expires in 5 minutes.`
            // });
            resetToken = process.env.NODE_ENV === 'production' ? null : resetToken;
            return responseHandler(res, resetToken, next, 200, 'Reset code has been sent to your email', 1)
        } catch (error) {
            console.log(error);
            return next(error);
        }

    }


    static async getUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await pool.query(query.getUserById(userId));
            if (!user.rows[0]) return errorHandler(404, 'Account was not found');

            user.password = '';
            return responseHandler(res, user.rows[0], next, 200, 'Account retrieved successfully', 1)
        } catch (error) {
            console.log(error);
            return next(error)
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const result = await pool.query(query.getAllUsers());
            if(result.rowCount < 1){
                return errorHandler(404, 'No user found');
            }
            return responseHandler(res, result.rows, next, 200, 'Users retrieved successfully', result.rowCount);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }


    static async deleteUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await pool.query(query.deleteUser(userId));
            if (user.rows[0]) errorHandler(404, "User was not found");
            return responseHandler(res, null, next, 204, 'Account deleted successfully', 1);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }


}

export default UserController;