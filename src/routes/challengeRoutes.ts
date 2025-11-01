import express from 'express'
import { startRandomDuel } from '../controller/challengeController'

const router = express.Router();

// POST /challenge/duel { trainer1Id, trainer2Id }
router.post('/duel', startRandomDuel);

export default router;
