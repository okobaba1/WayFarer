import express from 'express';
import valid from '../middleware/valid';
import Users from '../controller/users';
import { verifyUser, verifyAdmin, verifySuperAdmin } from '../middleware/jwt';

const { validator, validationHandler } = valid;
const router = express.Router();

router.post('/auth/signup', validator, validationHandler, Users.create);
router.post('/auth/signin', Users.login);



export default router;
