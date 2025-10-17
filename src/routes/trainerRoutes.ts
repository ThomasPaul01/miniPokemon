import express from 'express'

import { createTrainer, getAllTrainers, addPokemonToTrainer } from '../controller/trainerController';
const router = express.Router();
router.get('/getAll', getAllTrainers);
router.post('/create', createTrainer);
router.post('/addPokemon', addPokemonToTrainer);
export default router;