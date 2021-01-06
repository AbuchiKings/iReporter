import express from 'express'
import UserController from '../controller/userController';
import validator from '../middleware/validation';
import auth from './../middleware/Auth';
import {confirmOwnership} from './../middleware/permissions';


// Add restriction to avoid one user accessing anothers 
// Add non admin restriction
//Lift verification of token
//fix password update

const app = express()
const router = express.Router();
router.patch(
    '/users/:id/update-user',
    auth.verifyToken, confirmOwnership, UserController.updateUser, auth.signToken, auth.addToken
);

router.patch('/users/id/update-password',
    auth.verifyToken,
    validator.validatePasswordUpdate,
    validator.validationHandler,
    UserController.updatePassword
);


router.get('/users/:id',
    auth.verifyToken,
    validator.validateId,
    validator.validationHandler,
    confirmOwnership,
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