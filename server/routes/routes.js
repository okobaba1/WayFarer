import express from 'express';
import valid from '../middleware/valid';
import Users from '../controller/users';
import { verifyUser, verifyAdmin, verifySuperAdmin } from '../middleware/jwt';

const { validator, validationHandler, makeTrip } = valid;
const router = express.Router();

router.post('/auth/signup', validator, validationHandler, Users.create);
router.post('/auth/signin', Users.login);
router.post('/trips', makeTrip, validationHandler, verifyAdmin, Users.trip);
router.get('/trips', Users.getTrips);
router.post('/bookings', verifyUser, Users.makeBooking);

export default router;
