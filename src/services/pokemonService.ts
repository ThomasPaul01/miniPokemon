import { getAllPokemons, createPokemon, getPokemonsByTrainerId, teachAttackToPokemon, healPokemon, attackPokemon } from "../repositories/pokemonRepository";

export const listAllPokemons = async () => {
    return await getAllPokemons();
}

export const createNewPokemon = async (name: string, lifePoints: number) => {
    return await createPokemon(name, lifePoints);
}

export const getPokemonsForTrainer = async (trainerId: number) => {
    return await getPokemonsByTrainerId(trainerId);
}

export const learnAttack = async (pokemonId: number, attackId: number, limitUse: number) => {
    return await teachAttackToPokemon(pokemonId, attackId, limitUse);
};

export const heal = async (pokemonId: number) => {
    return await healPokemon(pokemonId);
};

export const attack = async (attackerId: number, defenderId: number) => {
    return await attackPokemon(attackerId, defenderId);
};