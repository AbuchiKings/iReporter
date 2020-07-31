import express from 'express'
import UserController from '../controller/userController';
import auth from '../middleware/Auth';
import validator from '../middleware/validation';
import auth from './../middleware/Auth';




const app = express()
const router = express.Router();
router.patch(
    '/users/:user_id/update-user',
    auth.verifyToken,
    UserController.updateUser
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
    UserController.getUserById
);

router.get('/users',
    auth.verifyToken,
    UserController.getAllUsers
);

router.patch('/users/profile-picture',
    auth.verifyToken,
    UserController.createProfileImage
);

router.post('/users/delete',
    auth.verifyToken,
    validator.validateDeleteUser,
    validator.validationHandler,
    UserController.deleteUser
);


export default router