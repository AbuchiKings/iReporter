import { body, sanitizeBody, param, query, validationResult } from 'express-validator';


const validateLogin = [
    body('email')
        .exists()
        .withMessage('A valid email must be provided.')
        .normalizeEmail({ all_lowercase: true })
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .exists()
        .withMessage('User password must be provided.')
        .isLength({ min: 5 })
        .withMessage('Password should have a minimum of 5 characters')
];

const validateSignup = [
    body(['firstname', 'lastname', 'username'])
        .exists()
        .withMessage('Name fields and username cannot be empty')
        .isString()
        .isLength({ min: 3 })
        .withMessage('Name fields and username must have a minimum of 3 characters'),
    sanitizeBody(['firstname', 'lastname', 'username', 'phoneNumber'])
        .customSanitizer(value => {
            if (value !== undefined) return value.replace(/\s+/g, '').trim();
        }),
    body('phone_number')
        .exists()
        .withMessage('A valid phone number must be provided')
        .isMobilePhone("any", { strictMode: true })
        .withMessage('Invalid mobile number'),
    validateLogin[0],
    validateLogin[1]
];

const validateReport = [
    body('title')
        .exists()
        .withMessage('Please attach a title to your report')
        .isLength({ min: 10, max: 30 })
        .withMessage('Title must have between 10 and 30 characters'),

    body('type')
        .exists()
        .withMessage('Please select a report type')
        .custom(type => {
            if (type) {
                return /^Red-flag$/.test(type) || /^Intervention$/.test(type);
            }
        })
        .withMessage('Invalid report type'),

    body('location')
        .exists()
        .withMessage('Report must location')
        .isLatLong()
        .withMessage('Invalid location'),

    body('status')
        .exists()
        .withMessage('Report must have a valid status')
        .matches(/^Draft$/)
        .withMessage('Invalid status type'),

    body('comment')
        .exists()
        .withMessage('Please attach a comment to your report')
        .isLength({ min: 50, max: 300 })
        .withMessage('Comment must have between 50 and 300 characters'),

    body('createdby')
        .exists()
        .withMessage('Please provide a user id')
        .isInt({ min: 1 })
        .withMessage('User id must be an integer with a minimum value of 1'),

    sanitizeBody(['title', 'type', 'comment', 'status'])
];

const validateId = [
    param('id')
        .exists()
        .withMessage('Provide an id')
        .isInt({ min: 1 })
        .withMessage('Route parameter, id, must be a positive integer not less than 1')
];

const validateGetReports = [
    query('userId')
        .exists()
        .optional()
        .isInt({ min: 1 })
        .withMessage('Id must be a positive integer not less than 1'),

    query('type')
        .exists()
        .optional()
        .custom(type => {
            if (type) {
                return /^Red-flag$/.test(type) || /^Intervention$/.test(type);
            }
        })
        .withMessage('Invalid report type'),

    query('status')
        .exists()
        .optional()
        .custom(status => {
            if (status) {
                let stat = (/^Draft$/.test(status) || /^Under investigation$/.test(status)) ||
                    (/^Rejected$/.test(status) || /^Resolved$/.test(status));
                return stat;
            }
        })
        .withMessage('Invalid report status'),

];

const validateEmailUpdate = [
    validateLogin
];

const validatePasswordUpdate = [
    body('oldPassword')
        .exists()
        .withMessage('User password must be provided.')
        .isLength({ min: 5 })
        .withMessage('Password should have a minimum of 5 characters')
        .custom((oldPassword, { req }) => {
            if ((oldPassword && req.body.newPassword) && oldPassword.length >= 5) {
                return oldPassword !== req.body.newPassword;
            }
        })
        .withMessage('New password cannot be equal to old password'),

    body('newPassword')
        .exists()
        .withMessage('New password must be provided.')
        .isLength({ min: 5 })
        .withMessage('New password should have a minimum of 5 characters')

];

const validateDeleteUser = [
    validateLogin[1]
];


const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        next();
    }
};

const validator = {
    validateLogin,
    validateSignup,
    validateReport,
    validateId,
    validateGetReports,
    validatePasswordUpdate,
    validateEmailUpdate,
    validateDeleteUser,
    validationHandler
};
export default validator;
