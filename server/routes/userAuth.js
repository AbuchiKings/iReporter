import {Router} from 'express';
import UserController from '../controller/userController'
import cors from 'cors'

const router = Router();
router.use(cors())

router.post('/auth/signup', UserController.createUser);

router.post('/auth/login', UserController.login);

export default router;