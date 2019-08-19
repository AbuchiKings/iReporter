import express from 'express'
import UserController from '../controller/userController';
import auth from '../middleware/Auth';
import validator from '../middleware/validation';



const app = express()
const router = express.Router();
router.patch(
    '/users/update-email',
    auth.verifyToken,
    validator.validateEmailUpdate,
    validator.validationHandler,
    UserController.updateUserEmail
);

router.patch('/users/update-password',
    auth.verifyToken,
    validator.validatePasswordUpdate,
    validator.validationHandler,
    UserController.updatePassword
);

router.get('/users/get-by-username/:username',
    auth.verifyToken,
    UserController.getUserByUserName
);

router.get('/users/:id',
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