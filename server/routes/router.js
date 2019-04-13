import { Router } from 'express';
import incidentApi from './incident';
import usersApi from './users'
import authApi from './userAuth'

const router = Router();

router.use('/api/v1', incidentApi);

//router.use('/api/v1', usersApi);

router.use('/api/v1', authApi);

export default router;