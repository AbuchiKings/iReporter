import { Router } from 'express';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/validation'

const router = Router();

router.get('/incidents', IncidentController.getAll);

router.get('/incidents/:id', validator.validateId, 
validator.validate, 
IncidentController.get0ne
);

export default router;
