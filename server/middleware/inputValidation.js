const validationErrors = [];
const validate = {
    parameterId: req => {
        
        if (!req.params.id || /^([1-9]+|[1-9][0-9]+)$/.test(req.params.id) === false) {
            validationErrors.push('Incident Id must be a positve integer');
        }
    },

    userId: req => {
        
        if (!req.body.createdBy || /^([1-9]+|[1-9][0-9]+)$/.test(req.body.createdBy) === false) {
            validationErrors.push('User Id must be a positve integer');
        }
    },

    incidentLocation: req => {
        const match = /(Latitude:\s+(-?)(\d){1,2}(\.?)(\d){0,7}\s+Longitude:\s+(-?)(\d){1,3}(\.?)(\d){0,7})/i;
        if (!req.body.location || 
            match.test(req.body.location) === false) {
            validationErrors.push('Location  must be written in this format: Latitude:34.87 Longtitude: 87.98')
        }
    },

    incidentType: req => {
        const match1 = /^(Red\-flag)$/i;
        const match2 = /^(Intervention)$/i;
        const check = (() => { return match1.test(req.body.type) ||
             match2.test(req.body.type) })();
        if (!req.body.type || check === false) {
            validationErrors.push('Incident type can either be a red flag or intervention');
        }

    },

    newComment: req => {
        const match = /^[a-zA-Z0-9+-,?'";)(/.:\s!@#+&%"]+/g;
        if ((!req.body.comment || req.body.comment.length === 0) || 
            (match.test(req.body.comment) === false ||
            isNaN(req.body.comment) !== true)) {
            validationErrors.push('Please, a valid comment is required');
        }

    }
};



const validateId = (req, res, next) => {
    validationErrors.length = 0;
    validate.parameterId(req);
    next();
};

const validateNewIncident = (req, res, next) => {
    validationErrors.length = 0;
    validate.userId(req);
   validate.incidentLocation(req);
    validate.incidentType(req);
    validate.newComment(req);
   next();
};

const validateNewLocation = (req, res, next) => {
    validationErrors.length = 0;
    validate.incidentLocation(req);
    next();
};

const validateNewComment = (req, res, next) => {
    validationErrors.length = 0;
    validate.newComment(req);
    next();
};


const validationHandler = (req, res, next) => {
    if (validationErrors.length) {
        res.status(422).json({ error: validationErrors });
    } else {
        next();
    }
};

const validator = {
    validateId,
    validationHandler,
    validateNewIncident,
    validateNewLocation,
    validateNewComment

};
export default validator;