import { Router } from 'express';
import bodyParser from 'body-parser';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
const jsonparser = bodyParser.json();
router.use((bodyParser.urlencoded({ extended: false })));

router.get('/incidents', IncidentController.getAll);

router.get('/incidents/:id', 
validator.validateId, 
validator.validationHandler, 
IncidentController.get0ne
);

router.post('/incidents/post', 
jsonparser,   
validator.validateNewIncident, 
validator.validationHandler,
IncidentController.createIncident
);


router.patch('/incidents/comment/:id',
jsonparser,
validator.validateNewComment,
validator.validationHandler, 
IncidentController.updateComment);

router.patch('/incidents/location/:id', 
jsonparser, 
validator.validateId,
validator.validateNewLocation,
validator.validationHandler,
IncidentController.updateLocation)


router.delete('/incidents/:id', 
validator.validateId, 
validator.validationHandler, 
IncidentController.deleteIncident)

export default router;
