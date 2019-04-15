import { Router } from 'express';
import UserController from '../controller/userController'
import auth from '../middleware/Auth'

const router = Router();

router.patch(
    '/users/update-email',
    auth.verifyToken,
    UserController.updateUserEmail
);

router.patch('/users/update-password',
    auth.verifyToken,
    UserController.updatePassword
);

router.get('/users/get-by-username/:username',
    auth.verifyToken,
    UserController.getUserByUserName
);

router.get('/users/:id',
    auth.verifyToken,
    UserController.getUserById
);

router.get('/users',
    auth.verifyToken,
    UserController.getAllUsers
);

router.delete('/users/delete',
    auth.verifyToken,
    UserController.deleteUser
)


export default router