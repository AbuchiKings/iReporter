import { Router } from 'express';
import bodyParser from 'body-parser';
<<<<<<< HEAD
import auth from '../middleware/Auth';
=======
import auth from '../middleware/Auth'
>>>>>>> ft-implement-real-time-email-notification

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
const jsonparser = bodyParser.json();
router.use((bodyParser.urlencoded({ extended: false })));

router.post('/red-flags',
    jsonparser,
    auth.verifyToken,
<<<<<<< HEAD
    validator.validateNewIncident,
    validator.validationHandler,
=======
>>>>>>> ft-implement-real-time-email-notification
    IncidentController.createIncident
);

router.get('/red-flags/:id',
    auth.verifyToken,
<<<<<<< HEAD
    validator.validateId,
    validator.validationHandler,
    IncidentController.get0ne
=======
    IncidentController.getOne
>>>>>>> ft-implement-real-time-email-notification
);

router.get('/red-flags',
    auth.verifyToken,
    IncidentController.getAll);

router.patch('/red-flags/:id',
    jsonparser,
    auth.verifyToken,
<<<<<<< HEAD
    validator.validateIncidentUpdate,
    validator.validationHandler,
=======
>>>>>>> ft-implement-real-time-email-notification
    IncidentController.updateIncident
);

router.patch('/red-flags/status/:id',
    jsonparser,
    auth.verifyToken,
<<<<<<< HEAD
    validator.validateStatusUpdate,
    validator.validationHandler,
=======
>>>>>>> ft-implement-real-time-email-notification
    IncidentController.updateIncidentStaus
);

router.delete('/red-flags/:id',
    auth.verifyToken,
<<<<<<< HEAD
    validator.validateId,
    validator.validationHandler,
=======
>>>>>>> ft-implement-real-time-email-notification
    IncidentController.deleteIncident
);


export default router;
