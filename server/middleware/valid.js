import { check, validationResult } from 'express-validator';

const validator = [
  check('first_name').not().isEmpty().withMessage('First name field cannot be empty.'),
  check('last_name').not().isEmpty().withMessage('Last name field cannot be empty.'),
  check('email').not().isEmpty().withMessage('Email field cannot be empty'),
  check('email').isEmail().withMessage('Enter valid email address.'),
  check('password').not().isEmpty().withMessage('Please password is required'),
  check('password').isLength({ min: 6 }).withMessage('Password should be atleast 6 characters'),
];

const makeTrip = [
  check('fare').not().isEmpty().withMessage('trip fare field cannot be empty.'),
  check('origin').not().isEmpty().withMessage('Kindly input take off point.'),
  check('destination').not().isEmpty().withMessage('Kindly input destination.'),
  check('bus_id').not().isEmpty().withMessage('Kindly input bus id.'),
  check('trip_date').not().isEmpty().withMessage('Kindly input trip date.'),

];


const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      error: errors.array().map(error => error.msg)[0],
    });
  }
  return next();
};

const valid = {
  validationHandler,
  validator,
  makeTrip,
};


export default valid;
