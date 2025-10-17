import { getAllPokemons, createPokemon, getPokemonsByTrainerId } from "../repositories/pokemonRepository";

export const listAllPokemons = async () => {
    return await getAllPokemons();
}

export const createNewPokemon = async (name: string, lifePoints: number, trainerId: number) => {
    return await createPokemon(name, lifePoints, trainerId);
}

export const getPokemonsForTrainer = async (trainerId: number) => {
    return await getPokemonsByTrainerId(trainerId);
}