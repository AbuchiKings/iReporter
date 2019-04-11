import { Router } from 'express';
import incidentApi from './incident';
import usersApi from './users'

const router = Router();

router.use('/api/v1', incidentApi);
router.use('/api/v1', usersApi);

export default router;