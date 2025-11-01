import express from 'express'
import { healTrainerPokemons } from '../controller/tavernController'

const router = express.Router();

// POST /tavern/heal { trainerId }
router.post('/heal', healTrainerPokemons);

export default router;
