import { Router } from 'express';
import bodyParser from 'body-parser';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
const jsonparser = bodyParser.json();
router.use((bodyParser.urlencoded({ extended: false })));

router.get('/red-flags', IncidentController.getAll);

router.get('/red-flags/:id', 
validator.validateId, 
validator.validationHandler, 
IncidentController.get0ne
);

router.post('/red-flags', 
jsonparser,   
validator.validateNewIncident, 
validator.validationHandler,
IncidentController.createIncident
);


router.patch('/red-flags/:id/comment',
jsonparser,
validator.validateNewComment,
validator.validationHandler, 
IncidentController.updateComment);

router.patch('/red-flags/:id/location', 
jsonparser, 
validator.validateId,
validator.validateNewLocation,
validator.validationHandler,
IncidentController.updateLocation)


router.delete('/red-flags/:id', 
validator.validateId, 
validator.validationHandler, 
IncidentController.deleteIncident)

export default router;
