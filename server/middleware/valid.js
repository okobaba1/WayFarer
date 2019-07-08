import { check, validationResult } from 'express-validator';

const validator = [
  check('first_name').not().isEmpty().withMessage('First name field cannot be empty.'),
  check('last_name').not().isEmpty().withMessage('Last name field cannot be empty.'),
  check('email').not().isEmpty().withMessage('Email field cannot be empty'),
  check('email').isEmail().withMessage('Enter valid email address.'),
  check('password').not().isEmpty().withMessage('Please password is required'),
  check('password').isLength({ min: 6 }).withMessage('Password should be atleast 6 characters'),

];


const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array().map(error => error.msg)[0],
    });
  }
  return next();
};

const valid = {
  validationHandler,
  validator,
};


export default valid;
