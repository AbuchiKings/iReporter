import {Router} from 'express';
import UserController from '../controller/userController'

const router = Router();

router.post('/auth/signup', UserController.createUser);

router.post('/auth/login', UserController.login);

export default router;