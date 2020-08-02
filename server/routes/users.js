import express from 'express'
import UserController from '../controller/userController';
import validator from '../middleware/validation';
import auth from './../middleware/Auth';


// Add restriction to avoid one user accessing anothers 
// Add non admin restriction
//Lift verification of token
//fix password update

const app = express()
const router = express.Router();
router.patch(
    '/users/:user_id/update-user',
    auth.verifyToken, UserController.updateUser, auth.signToken, auth.addToken
);

router.patch('/users/:user_id/update-password',
    auth.verifyToken,
    validator.validatePasswordUpdate,
    validator.validationHandler,
    UserController.updatePassword
);


router.get('/users/:user_id',
    auth.verifyToken,
    validator.validateId,
    validator.validationHandler,
    UserController.getUser
);

router.get('/users',
    auth.verifyToken,
    UserController.getAllUsers
);

router.post('/users/delete',
    auth.verifyToken,
    validator.validateDeleteUser,
    validator.validationHandler,
    UserController.deleteUser
);


export default router