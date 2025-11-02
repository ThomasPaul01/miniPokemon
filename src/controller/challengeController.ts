import { Request, Response } from "express";
import { randomDuel, deterministicDuel } from "../services/challengeService.ts";

export const startRandomDuel = async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const result = await randomDuel(Number(trainer1Id), Number(trainer2Id));
    res.status(200).json({
      message: "Duel terminé",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const startDeterministicDuel = async (req: Request, res: Response) => {
  try {
    const { trainer1Id, trainer2Id } = req.body;
    const result = await deterministicDuel(Number(trainer1Id), Number(trainer2Id));
    res.status(200).json({
      message: "Duel déterministe terminé",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
