import express from 'express';
import { someRoute } from '../controllers/someController'; // Adjust the import based on your controllers

const router = express.Router();

// Define your routes here
router.get('/some-endpoint', someRoute);

export default router;