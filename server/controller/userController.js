import 'babel-polyfill';
import Helper from '../helper/authHelper';



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
                    return res.status(401).json({ status: 401, message: 'Email address already exist' });

                case 'accountNotFound':
                    return res.status(404).json({ status: 404, message: 'Account not found' });
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
}

export default UserController;