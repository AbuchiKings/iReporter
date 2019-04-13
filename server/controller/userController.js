import 'babel-polyfill';
import Helper from '../helper/authHelper';
import responseHandler from '../middleware/responseHandler';



class UserController {
    static async createUser(req, res) {

        const result = await Helper.createUser(req);
        return responseHandler.handleResponse(res, 201, result, 'Account created successsfully')

    }

    static async login(req, res) {
        try {
            const result = await Helper.login(req);
            return responseHandler.handleResponse(res, 201, result, 'Logged in')
        } catch (error) {
            return console.log(error);
        }

    }
}

export default UserController;