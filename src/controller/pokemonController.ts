import { listAllPokemons, createNewPokemon, getPokemonsForTrainer } from "../services/pokemonService";
import { Request, Response } from "express";

export const getAllPokemons = async (req: Request, res: Response) => {
    try {
        const pokemons = await listAllPokemons();
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve pokemons" });
    }
};
export const createPokemon = async (req: Request, res: Response) => {
    const { name, lifePoints, trainerId } = req.body;
    try {
        const newPokemon = await createNewPokemon(name, lifePoints, trainerId);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(500).json({ error: "Failed to create pokemon" });
    }
};
export const getAllPokemonsForTrainer = async (req: Request, res: Response) => {
    const { trainerId } = req.body;
    try {
        const pokemons = await getPokemonsForTrainer(trainerId);
        res.status(200).json(pokemons);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve pokemons for trainer" });
    }
};
