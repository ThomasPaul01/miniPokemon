import { listAllPokemons, createNewPokemon, getPokemonsForTrainer, learnAttack, heal, attack } from "../services/pokemonService";
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

export const teachAttack = async (req: Request, res: Response) => {
    const { pokemonId, attackId, limitUse } = req.body;
    try {
        const result = await learnAttack(Number(pokemonId), Number(attackId), Number(limitUse));
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const healPokemonController = async (req: Request, res: Response) => {
    const { pokemonId } = req.body;
    try {
        const result = await heal(Number(pokemonId));
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const attackPokemonController = async (req: Request, res: Response) => {
    const { attackerId, defenderId } = req.body;
    try {
        const result = await attack(Number(attackerId), Number(defenderId));
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
