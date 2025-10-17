import express from 'express'

import { createTrainer, getAllTrainers } from '../controller/trainerController';
const router = express.Router();
router.get('/getAll', getAllTrainers);
router.post('/create', createTrainer);
export default router;