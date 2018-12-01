import { Router } from 'express';
import bodyParser from 'body-parser';

import IncidentController from '../controller/incidentController';
import validator from '../middleware/inputValidation';

const router = Router();
router.use(bodyParser.json());
router.use((bodyParser.urlencoded({ extended: false })));

router.get('/incidents', IncidentController.getAll);

router.get('/incidents/:id', validator.validateId, 
validator.validationHandler, 
IncidentController.get0ne
);

router.post('/incidents/post',    
validator.validateNewIncident, validator.validationHandler,
IncidentController.createIncident
);



export default router;
