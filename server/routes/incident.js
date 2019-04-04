import { Router } from 'express';
import bodyParser from 'body-parser';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
const jsonparser = bodyParser.json();
router.use((bodyParser.urlencoded({ extended: false })));

router.post('/red-flags',
    jsonparser,
    validator.validateNewIncident,
    validator.validationHandler,
    IncidentController.createIncident
);

router.get('/red-flags/:id',
    validator.validateId,
    validator.validationHandler,
    IncidentController.get0ne
);

router.get('/red-flags', IncidentController.getAll);

router.patch('/red-flags/:id',
    jsonparser,
    validator.validateIncidentUpdate,
    validator.validationHandler,
    IncidentController.updateIncident);


export default router;
