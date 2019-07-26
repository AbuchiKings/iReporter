import 'babel-polyfill';
import Helper from '../helper/authHelper';
import dotenv from 'dotenv';
import formidable from 'formidable';
import { relative, join, resolve } from 'path'


class UserController {
    static async createUser(req, res) {
        try {
            const result = await Helper.createUser(req);
            switch (result) {
                case 'notUniqueEmail':
                    return res.status(409).json({ status: 409, message: 'Email address already exist' });

                case 'notUniqueUserName':
                    return res.status(409).json({ status: 409, message: 'Username already exist' });

                case 'notUniqueUserPhoneNumber':
                    return res.status(409).json({ status: 409, message: 'Phone number  already exist' });
            }
            return res.status(201).json({
                status: 201,
                data: [result],
                message: 'Account created'

            })
        } catch (error) {
            console.log(error)
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
                console.log('Uploaded ' + file.name);
                console.log(result);
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