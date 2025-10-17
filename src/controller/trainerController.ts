import {listAllTrainers, createNewTrainer} from "../services/trainerService";
import { Request, Response } from "express";
export const createTrainer = async (req: Request, res: Response) => {
    const { name, level, experience } = req.body;
    try {
        const newTrainer = await createNewTrainer(name, level, experience);
        res.status(201).json(newTrainer);
    } catch (error) {
        res.status(500).json({ error: "Failed to create trainer" });
    }
};
export const getAllTrainers = async (req: Request, res: Response) => {
    try {
        const trainers = await listAllTrainers();
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve trainers" });
    }
};
