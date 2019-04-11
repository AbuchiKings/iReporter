import 'babel-polyfill';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../queries/dbqueries';
import pool from '../queries/pool';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_KEY;

class Helper {

    static async createUser(data) {
        try {
            const { firstName, lastName, otherNames, email, password, userName, phoneNumber } = data;
            const username1 = userName.toLowerCase();

            const { rowCount } = await pool.query(query.getUserByUserName(username1));
            const foundUser = await pool.query(query.getUserByEmail(email));
            const {rows} = await pool.query(query.getUserByPhone(phoneNumber));

            if ((rowCount > 0 || foundUser.rows[0] > 0) || rows[0]) return 409;

            const hashpassword = await bcrypt.hash(password, 10);
            const user = await pool.query(query.regUser(firstName, lastName, otherNames, email, phoneNumber, userName, hashpassword));

            return user.rows[0];

        } catch (error) {
            return error;
        }
    }

}

export default Helper;