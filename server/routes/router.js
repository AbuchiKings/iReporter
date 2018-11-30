import { Router } from 'express';
import incidentApi from './incident';

const router = Router();

router.use('/api/v1', incidentApi);

export default router;