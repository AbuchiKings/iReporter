import {Router} from 'express';
import UserController from '../controller/userController'
import validator from '../middleware/validation'
import cors from 'cors'

const router = Router();
router.use(cors())

router.post('/auth/signup', validator.validateSignup, validator.validationHandler, UserController.createUser);

router.post('/auth/login', validator.validateLogin, validator.validationHandler, UserController.login);

export default router;