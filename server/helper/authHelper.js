import 'babel-polyfill';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../queries/dbqueries';
import pool from '../queries/pool';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_KEY;

class Helper {

    static async createUser(req) {
        try {
            const { firstName, lastName, otherNames, email, password, userName, phoneNumber } = req.body;
            const username1 = userName.toLowerCase();

            const { rowCount } = await pool.query(query.getUserByUserName(username1));
            const foundUser = await pool.query(query.getUserByEmail(email));
            const result = await pool.query(query.getUserByPhone(phoneNumber));

            if (rowCount > 0) return 'notUniqueUserName';
            if (foundUser.rowCount > 0) return 'notUniqueEmail';
            if (result.rowCount > 0) return 'notUniquePhoneNumber';

            let isAdmin;
            if (req.user && (req.user.id === 1 && req.user.isAdmin === true)) {
                isAdmin = true;
            } else { isAdmin = false; }

            //if(password.length < 8) responseHandler.handleError('Password less than acceptable length')

            const hashpassword = await bcrypt.hash(password, 10);
            const user = await pool.query(query.regUser(firstName, lastName, otherNames, email, phoneNumber, userName, hashpassword, isAdmin));

            return user.rows[0];

        } catch (error) {
            return error;
        }
    }

    static async login(req) {
        try {
            const { userName, email, password } = req.body;
            let result;
            if (userName) {
                let username1 = userName.toLowerCase();
                result = await pool.query(query.getUserByUserName(username1));
            }
            /* else if (email) {
                 result = await pool.query(query.getUserByUserName(email));
             }*/

            if (!result.rows[0]) return 'accountNotFound';
            const db = result.rows[0];
            const validPassword = await bcrypt.compare(password, db.password);

            if (!validPassword) return 'invalidPassword';

            const { id, is_admin } = db;

            const token = jwt.sign({ id, email, is_admin }, SECRET, { expiresIn: '12h' });

            return { token, is_admin };
        } catch (error) {
            return error;

        }

    }

    static async updateUserEmail(req) {
        try {
            const userId = parseInt(req.user.id, 10);

            const { rows } = await pool.query(query.getUserById(userId));
            if (!rows[0]) return 'accountNotFound';

            const foundUser = await pool.query(query.getUserByEmail(req.body.email));
            if (foundUser.rowCount > 0) return 'notUniqueEmail';

            const result = await pool.query(query.updateUserEmail(req.body.email, userId));

            const user = result.rows[0];
            const newEmail = user.email;
            const { id, is_admin } = user;
            const token = jwt.sign({ id, newEmail, is_admin }, SECRET, { expiresIn: '12h' });

            return { token, user };

        } catch (error) {
            return error;
        }
    }

    static async updatePassword(req) {
        try {
            const userId = parseInt(req.user.id, 10);

            const { rows } = await pool.query(query.getUserById(userId));
            if (!rows[0]) return 'accountNotFound';

            const { oldPassword, newPassword } = req.body;
            const db = rows[0];
            const validPassword = await bcrypt.compare(oldPassword, db.password);

            if (!validPassword) return 'invalidPassword';

            const hashNewPassword = await bcrypt.hash(newPassword, 10);

            const result = await pool.query(query.updateUserPassword(hashNewPassword, userId));

            const user = result.rows[0];
            const { id, email, is_admin } = user;

            const token = jwt.sign({ id, email, is_admin }, SECRET, { expiresIn: '12h' });

            return { token, user };

        } catch (error) {
            console.log(error);
        }
    }

    static async getUserByUserName(req) {
        try {
            const isAdmin = req.user.is_admin;

            if (!isAdmin) {
                return 'forbidden';
            }

            let username1 = req.params.username.toLowerCase();
            const result = await pool.query(query.getUserByUserName(username1));
            if (result.rowCount < 1) return 'accountNotFound';

            return result.rows[0];

        } catch (error) {
            console.log(error);
        }
    }

    static async getUserById(req) {
        try {
            const isAdmin = req.user.is_admin;

            if (!isAdmin) {
                return 'forbidden';
            }

            let id = parseInt(req.params.id, 10);
            const result = await pool.query(query.getUserById(id));
            if (result.rowCount < 1) return 'accountNotFound';

            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async getUsers(req) {
        try {
            const userId = req.user.id;
            const { rows, rowCount } = await pool.query(query.getUserById(userId));

            if (rowCount < 1) return 'accountNotFound';

            const user = rows[0];
            if (!user.is_admin) {
                return 'forbidden';
            }

            const result = await pool.query(query.getAllUsers());
            if (result.rowCount < 1) return 'accountNotFound';

            return result.rows[0];
        } catch (error) {
            return error;
        }

    }

    static async deleteUser(req) {
        try {
            const userId = req.user.id;
            const { rows, rowCount } = await pool.query(query.getUserById(userId));

            if (rowCount < 1) return 'accountNotFound';

            const user = rows[0];
            if (user.is_admin && user.id === 1) {
                return 'forbidden';
            }

            const result = await pool.query(query.deleteUser(userId));
            return result.rows[0];

        } catch (error) {
            return error;
        }
    }
}

export default Helper;