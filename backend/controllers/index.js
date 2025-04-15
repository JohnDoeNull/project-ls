import express from 'express';
import userController from './userController';
import cultureController from './cultureController';
import eventController from './eventController';

const router = express.Router();

router.use('/users', userController);
router.use('/cultures', cultureController);
router.use('/events', eventController);

export default router;