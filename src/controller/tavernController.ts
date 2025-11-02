import { Request, Response } from "express";
import { healAllForTrainer } from "../services/tavernService";

export const healTrainerPokemons = async (req: Request, res: Response) => {
  try {
    const { trainerId } = req.body;
    const summary = await healAllForTrainer(Number(trainerId));
    res.status(200).json({ message: "Tous les pokémons ont été soignés et les usages des attaques ont été réinitialisés", ...summary });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
