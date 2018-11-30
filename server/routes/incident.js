import { Router } from 'express';

import IncidentController from '../controller/incidentController';

const router = Router();

router.get('/incidents', IncidentController.getAll);

export default router;
