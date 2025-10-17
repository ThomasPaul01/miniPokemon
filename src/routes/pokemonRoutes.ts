import express from 'express'

import { createPokemon, getAllPokemonsForTrainer, getAllPokemons } from '../controller/pokemonController';
const router = express.Router();
router.get('/getAll', getAllPokemons);
router.post('/create', createPokemon);
router.get('/getAll/:trainerId', getAllPokemonsForTrainer);
export default router;