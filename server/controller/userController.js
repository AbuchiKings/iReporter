import 'babel-polyfill';
import Helper from '../helper/authHelper'


class UserController {
    static async createUser(req, res) {
        try {
            const result = await Helper.createUser(req.body);
            if (result === 409) {
                res.status(409).send({
                    status: 409,
                    message: 'User with email, phonenumber or username already exist'
                })
                return;
            }

            res.status(201).send({ 
                status: 201,
                data: [result], 
                message: 'Account created successfully'
             })
        } catch (error) {
            console.log(error);

        }
    }
}

export default UserController;