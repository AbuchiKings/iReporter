import 'core-js/stable';
import 'regenerator-runtime';
import Helper from '../helper/authHelper';
import formidable from 'formidable';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import query from '../queries/dbqueries';
import pool from '../queries/pool';
import { relative, join, resolve } from 'path'
import responseHandler from '../utils/responseHandler';
import errorHandler from './../utils/errorHandler';



class UserController {
    static async createUser(req, res, next) {
        try {
            const { firstName, lastName, email, password, confirmPassword, userName, phoneNumber, admin_code } = req.body;
            if(confirmPassword !== password) errorHandler(422, 'Passwords do not match');

            let isAdmin = process.env.ADMIN_CODE === admin_code? true: false;
            const hashpassword = await bcrypt.hash(password, 10);
            const user = await pool.query(query.regUser(firstName, lastName, email, phoneNumber, userName, hashpassword, isAdmin));
             user.rows[0];
            return responseHandler();
        } catch (error) {
            return next(error);
        }


    }

    static async login(req, res) {
        try {
            const result = await Helper.login(req);
            switch (result) {
                case 'invalidPassword':
                    return res.status(401).json({ status: 401, message: 'Invalid password' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
            }
            return res.status(201).json({
                status: 201,
                data: [result],
                message: 'Logged in'

            })
        } catch (error) {
            console.log(error);
        }

    }

    static async updateUserEmail(req, res) {
        try {

            const result = await Helper.updateUserEmail(req);
            switch (result) {
                case 'notUniqueEmail':
                    return res.status(409).json({ status: 401, message: 'Email address already exist' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });

                case 'invalidPassword':
                    return res.status(401).json({ status: 401, message: 'Invalid password' });
            }
            return res.status(201).json({
                status: 201,
                data: [result],
                message: 'Email updated'

            })
        } catch (error) {
            console.log(error);
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

    static async getUserByUserName(req, res) {
        try {
            const result = await Helper.getUserByUserName(req);
            switch (result) {

                case 'forbidden':
                    return res.status(403).json({ status: 403, message: 'Forbidden' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
            }
            return res.status(200).json({
                status: 200,
                data: [result]

            })
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserById(req, res) {
        try {
            const result = await Helper.getUserById(req);
            switch (result) {

                case 'forbidden':
                    return res.status(403).json({ status: 403, message: 'Forbidden' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
            }
            return res.status(200).json({
                status: 200,
                data: [result]

            })
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllUsers(req, res) {
        try {
            const result = await Helper.getAllUsers(req);
            switch (result) {

                case 'forbidden':
                    return res.status(403).json({ status: 403, message: 'Forbidden' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
            }
            return res.status(200).json({
                status: 200,
                data: [result]

            });
        } catch (error) {
            console.log(error);
        }
    }

    static async createProfileImage(req, res) {
        try {
            let result;
            const form = new formidable.IncomingForm();
            form.parse(req);

            form.on('fileBegin', function (name, file) {

                file.path = join(resolve('./'), `/uploads/${file.name}`);
            });

            form.on('file', async function (name, file) {
                result = await Helper.createProfileImage(req, file.path);
          
                if (result === 'cloudinary error') {
                    return res.status(503).json({status: 503, message: 'Service unavailable'})
                }

                return res.status(201).json({
                    status: 201,
                    data: [result],
                    message: 'Updated'

                });
            });


        } catch (error) {
            console.log(error);
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