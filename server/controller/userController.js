import 'babel-polyfill';
import Helper from '../helper/authHelper';
import responseHandler from '../tools/responseHandler';



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
            res.send(error);
        }

    }

    static async updateUserEmail(req, res){
        try {
            
            const result = await Helper.updateUserEmail(req);
            return responseHandler.handleResponse(res, 201, result, 'Email updated')
        } catch (error) {
            res.send(error);
        }
    }
}

export default UserController;