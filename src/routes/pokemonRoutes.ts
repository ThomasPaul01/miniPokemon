import express from 'express'

import { createPokemon, getAllPokemonsForTrainer, getAllPokemons, teachAttack, healPokemonController, attackPokemonController } from '../controller/pokemonController';
const router = express.Router();
router.get('/getAll', getAllPokemons);
router.post('/create', createPokemon);
router.get('/getAll/:trainerId', getAllPokemonsForTrainer);
router.post('/learnAttack', teachAttack);
router.post('/heal', healPokemonController);
router.post('/attack', attackPokemonController);
export default router;