import express from 'express'
import { createAttack, getAllAttacks } from '../controller/attackController';
const router = express.Router();
router.get('/getAll', getAllAttacks);
router.post('/create', createAttack);
export default router;