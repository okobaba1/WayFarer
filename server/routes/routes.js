import express from 'express';
import valid from '../middleware/valid';
import Users from '../controller/users';
import { verifyUser, verifyAdmin, verifyHelp } from '../middleware/jwt';

const { validator, validationHandler, makeTrip } = valid;
const router = express.Router();

router.post('/auth/signup', validator, validationHandler, Users.create);
router.post('/auth/signin', Users.login);
router.post('/trips', makeTrip, validationHandler, verifyAdmin, Users.trip);
router.get('/trips', verifyHelp, Users.getTrips);
router.post('/bookings', verifyUser, Users.makeBooking);
router.get('/bookings', verifyHelp, Users.getbookings);
router.delete('/bookings/:bookingId', verifyUser, Users.deleteBooking);
router.patch('/trips/:tripId', verifyAdmin, Users.cancelTrip);
router.patch('/bookings/:bookingId', verifyUser, Users.changeSeats);

export default router;
