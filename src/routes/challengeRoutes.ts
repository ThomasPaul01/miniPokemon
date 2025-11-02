import express from 'express'
import { startRandomDuel, startDeterministicDuel } from '../controller/challengeController.ts'

const router = express.Router();

// POST /challenge/duel { trainer1Id, trainer2Id }
router.post('/duel', startRandomDuel);

// POST /challenge/deterministic { trainer1Id, trainer2Id }
router.post('/deterministic', startDeterministicDuel);

export default router;
