import {createNewAttack, listAllAttacks} from "../services/attackService";
import { Request, Response } from "express";

export const createAttack = async (req: Request, res: Response) => {
    const { name, damage, limitUse, pokemonId } = req.body;
    try {
        const newAttack = await createNewAttack(name, damage, limitUse, pokemonId);
        res.status(201).json(newAttack);
    } catch (error) {
        res.status(500).json({ error: "Failed to create attack" });
    }
};

export const getAllAttacks = async (req: Request, res: Response) => {
    try {
        const attacks = await listAllAttacks();
        res.status(200).json(attacks);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve attacks" });
    }
};
