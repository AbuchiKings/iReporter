import { Router } from 'express';
import UserController from '../controller/userController'
import auth from '../middleware/Auth'

const router = Router();

router.use(
    '/users/email-update',
    auth.verifyToken,
    UserController.updateUserEmail
)


export default router