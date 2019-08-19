const validationErrors = [];
/****        .custom(phoneNumber => /^(\+?234)?0?[7-9]0[0-9]{8}$/.test(phoneNumber))
 */
const validate = {
    parameterId: req => {

        if (!req.params.id || /^([1-9]+|[1-9][0-9]+)$/.test(req.params.id) === false) {
            validationErrors.push('Incident Id must be a positve integer');
        }
    },

    userId: req => {

        if (!req.body.createdby || /^([1-9]+|[1-9][0-9]+)$/.test(Number(req.body.createdby)) === false) {
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
        const check = (() => {
            return match1.test(req.body.type) ||
                match2.test(req.body.type)
        })();
        if (!req.body.type || check === false) {
            validationErrors.push('Incident type can either be a red flag or intervention');
        }

    },

    incidentStatus: req => {
        if (!req.body.status) { }
        else {
            const match1 = /^(Pending)$/i;
            const match2 = /^(Rejected)$/i;
            const match3 = /^(Resolved)$/i;
            const check = (() => {
                return (match1.test(req.body.status) ||
                    match2.test(req.body.status)) || match3.test(req.body.status)
            })();
            if (check === false) {
                validationErrors.push('Incident status can either be pending, rejected or resolved');
            }
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
    //validate.userId(req);
    validate.incidentLocation(req);
    validate.incidentType(req);
    validate.newComment(req);
    next();
};

const validateIncidentUpdate = (req, res, next) => {
    validationErrors.length = 0;
    validate.parameterId(req);
    if (req.body.location) validate.incidentLocation(req);
    if (req.body.type) validate.incidentType(req);
    if (req.body.comment) validate.newComment(req);
    next();
};

const validateStatusUpdate = (req, res, next) => {
    validationErrors.length = 0;
    validate.parameterId(req);
    validate.incidentStatus(req);
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
    validateStatusUpdate,
    validateIncidentUpdate,
    validationHandler,
    validateNewIncident,
    validateNewComment
};
export default validator;