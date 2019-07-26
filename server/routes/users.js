//import { Router } from 'express';
import express from 'express'
import UserController from '../controller/userController';
import auth from '../middleware/Auth';
import util from 'util';


/*var storage = multer.diskStorage({
    destination: '/tmp'
    ,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })*/

const app = express()
const router = express.Router();
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

router.patch('/users/profile-picture',
    auth.verifyToken,
    UserController.createProfileImage
);

router.post('/users/delete',
    auth.verifyToken,
    UserController.deleteUser
);


export default router