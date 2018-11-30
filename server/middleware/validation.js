import { body, param, validationResult } from 'express-validator/check';

const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Incident id must be a positve number')
];


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ error: errors.array()});
    } else {
      next();
    }
  };
  
  const validator = {
    validateId,
    validate
  };
  export default validator;