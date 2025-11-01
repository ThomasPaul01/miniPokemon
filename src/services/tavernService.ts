import { getPokemonsByTrainerId, healPokemon } from "../repositories/pokemonRepository";

export interface HealSummaryItem {
  id: number;
  name: string;
  healed: boolean;
}

export interface HealSummary {
  trainerId: number;
  count: number;
  pokemons: HealSummaryItem[];
}

export const healAllForTrainer = async (trainerId: number): Promise<HealSummary> => {
  if (!trainerId) throw new Error("trainerId is required");

  const pokemons = await getPokemonsByTrainerId(trainerId);
  if (!pokemons.length) {
    return { trainerId, count: 0, pokemons: [] };
  }

  await Promise.all(pokemons.map((p: any) => healPokemon(p.id)));

  return {
    trainerId,
    count: pokemons.length,
    pokemons: pokemons.map((p: any) => ({ id: p.id, name: p.name, healed: true }))
  };
};
