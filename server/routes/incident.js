import { Router } from 'express';
import bodyParser from 'body-parser';
import auth from '../middleware/Auth';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
const jsonparser = bodyParser.json();
router.use((bodyParser.urlencoded({ extended: false })));

router.post('/red-flags',
    jsonparser,
    auth.verifyToken,
    validator.validateNewIncident,
    validator.validationHandler,
    IncidentController.createIncident
);

router.get('/red-flags/:id',
    auth.verifyToken,
    validator.validateId,
    validator.validationHandler,
    IncidentController.get0ne
);

router.get('/red-flags',
    auth.verifyToken,
    IncidentController.getAll);

router.patch('/red-flags/:id',
    jsonparser,
    auth.verifyToken,
    validator.validateIncidentUpdate,
    validator.validationHandler,
    IncidentController.updateIncident
);

router.patch('/red-flags/status/:id',
    jsonparser,
    auth.verifyToken,
    validator.validateStatusUpdate,
    validator.validationHandler,
    IncidentController.updateIncidentStaus
);

router.delete('/red-flags/:id',
    auth.verifyToken,
    validator.validateId,
    validator.validationHandler,
    IncidentController.deleteIncident
);


export default router;
