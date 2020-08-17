import {Router} from 'express';
import UserController from '../controller/userController'
import validator from '../middleware/validation'
import auth from './../middleware/Auth';

const router = Router();

router.post('/auth/signup', validator.validateSignup, validator.validationHandler, UserController.createUser);

router.post('/auth/login', validator.validateLogin, validator.validationHandler, UserController.login, auth.signToken, auth.addToken);

router.post('/auth/reset-password', UserController.forgotPassword);

export default router;