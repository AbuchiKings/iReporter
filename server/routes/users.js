import {Router} from 'express';
import UserController from '../controller/userController'

const router = Router();

router.post('/auth/signup', UserController.createUser);

export default router