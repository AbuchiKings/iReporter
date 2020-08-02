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


function errorMessage(msg) {
    const reg = /users_phone_number_key|users_username_key|users_email_key/;
    const duplicateMessages = {
        "users_email_key": "This email is already in use",
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

const factor = parseInt(process.env.HASH_FACTOR);

class UserController {

    static async createUser(req, res, next) {
        try {
            const { firstname, lastname, email, password, confirmPassword, username, phoneNumber, admin_code } = req.body;
            if (confirmPassword !== password) errorHandler(422, 'Passwords do not match');

            let isAdmin = process.env.ADMIN_CODE === admin_code ? true : false;
            //const hashpassword = await bcrypt.hash(password, factor);
            const hashpassword = await auth.hashPassword(password);

            const user = await pool.query(query.regUser(firstname, lastname, email, phoneNumber, username.toLowerCase(), hashpassword, isAdmin));
            const result = user.rows[0];
            result.password = '';
            //later add a code for email or phone verification
            return responseHandler(res, result, next, 201, 'Account was successfully created', 1);
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
            const validPassword = await auth.isVerified(password, user.password);

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

            const userId = parseInt(req.user.id, 10);
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
            return next(error);
        }
    }

    static async updatePassword(req, res) {
        try {
            const result = await Helper.updatePassword(req);
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
        }
    }


    static async getUser(req, res, next) {
        try {
            const userId = parseInt(req.user.id, 10);
            const user = await pool.query(query.getUserById(userId));
            if (!user.rows[0]) return errorHandler(404, 'Account was not found');

            user.password = '';
            return responseHandler(res, user.rows[0], next, 200, 'Account retrieved successfully', 1)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const result = await pool.query(query.getAllUsers());
            return responseHandler(res, result.rows, next, 200, 'Users retrieved successfully', result.rowCount);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }


    static async deleteUser(req, res) {
        try {
            const result = await Helper.deleteUser(req);
            switch (result) {

                case 'forbidden':
                    return res.status(403).json({ status: 403, message: 'Forbidden' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });

                case 'invalidPassword':
                    return res.status(401).json({ status: 401, message: 'Invalid password' });
            }
            return res.status(200).json({
                status: 204,
                message: 'Account deleted successfully'

            })
        } catch (error) {
            console.log(error);
        }
    }


}

export default UserController;