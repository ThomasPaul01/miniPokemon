import { Request, Response } from "express";
import { randomDuel, deterministicDuel, randomDuelRounds, deterministicDuelRounds } from "../services/challengeService.ts";

export const startRandomDuel = async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id, rounds } = req.body;
    const r = Number(rounds) || 1;
    if (r > 1) {
      const result = await randomDuelRounds(Number(trainer1Id), Number(trainer2Id), r);
      res.status(200).json({ message: `Duel aléatoire en ${r} rounds terminé`, ...result });
    } else {
      const result = await randomDuel(Number(trainer1Id), Number(trainer2Id));
      res.status(200).json({ message: "Duel terminé", ...result });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const startDeterministicDuel = async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id, rounds } = req.body;
    const r = Number(rounds) || 1;
    if (r > 1) {
      const result = await deterministicDuelRounds(Number(trainer1Id), Number(trainer2Id), r);
      res.status(200).json({ message: `Duel déterministe en ${r} rounds terminé`, ...result });
    } else {
      const result = await deterministicDuel(Number(trainer1Id), Number(trainer2Id));
      res.status(200).json({ message: "Duel déterministe terminé", ...result });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
