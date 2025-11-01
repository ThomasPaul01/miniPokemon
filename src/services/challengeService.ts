import { getPokemonsByTrainerId, healPokemon, attackPokemon } from "../repositories/pokemonRepository";

export interface BattleTurn {
  turn: number;
  attackerId: number;
  defenderId: number;
  attackId: number;
  attackName: string;
  attackerName: string;
  defenderName: string;
  damage: number;
  defenderLifeAfter: number;
}

export interface BattleResult {
  trainer1Id: number;
  trainer2Id: number;
  pokemon1Id: number;
  pokemon2Id: number;
  pokemon1Name: string;
  pokemon2Name: string;
  winnerTrainerId: number;
  winnerPokemonId: number;
  winnerPokemonName: string;
  log: BattleTurn[];
}

export const randomDuel = async (trainer1Id: number, trainer2Id: number): Promise<BattleResult> => {
  if (!trainer1Id || !trainer2Id) {
    throw new Error("trainer1Id and trainer2Id are required");
  }

  // Récupérer les pokémons des deux dresseurs
  const pokemons1 = await getPokemonsByTrainerId(trainer1Id);
  const pokemons2 = await getPokemonsByTrainerId(trainer2Id);

  if (!pokemons1.length) throw new Error(`Trainer ${trainer1Id} has no pokemons`);
  if (!pokemons2.length) throw new Error(`Trainer ${trainer2Id} has no pokemons`);

  // Soigner tous les pokémons de chaque dresseur
  await Promise.all(pokemons1.map((p: any) => healPokemon(p.id)));
  await Promise.all(pokemons2.map((p: any) => healPokemon(p.id)));

  // Choisir un pokémon aléatoire pour chaque dresseur
  const pokemon1 = pokemons1[Math.floor(Math.random() * pokemons1.length)];
  const pokemon2 = pokemons2[Math.floor(Math.random() * pokemons2.length)];

  let attacker = { trainerId: trainer1Id, pokemonId: pokemon1.id };
  let defender = { trainerId: trainer2Id, pokemonId: pokemon2.id };

  // On considère que la vie a été remise à 100 lors du heal
  let life1 = 100;
  let life2 = 100;
  const log: BattleTurn[] = [];
  let turn = 1;

  while (life1 > 0 && life2 > 0) {
    const res = await attackPokemon(attacker.pokemonId, defender.pokemonId);
    const damage = Number(res.attack.damage);
    const defenderAfter = Number(res.defender.life_points);

    log.push({
      turn,
      attackerId: attacker.pokemonId,
      defenderId: defender.pokemonId,
      attackId: res.attack.id,
      attackName: res.attack.name,
      attackerName: attacker.pokemonId === pokemon1.id ? pokemon1.name : pokemon2.name,
      defenderName: defender.pokemonId === pokemon1.id ? pokemon1.name : pokemon2.name,
      damage,
      defenderLifeAfter: defenderAfter,
    });

    if (defender.pokemonId === pokemon1.id) {
      life1 = defenderAfter;
    } else {
      life2 = defenderAfter;
    }

    if (defenderAfter <= 0) break;

    // Inverser les rôles
    const tmp = attacker;
    attacker = defender;
    defender = tmp;
    turn += 1;
  }

  const winnerIs1 = life1 > 0;
  const winnerPokemonId = winnerIs1 ? pokemon1.id : pokemon2.id;
  const winnerTrainerId = winnerIs1 ? trainer1Id : trainer2Id;
  const winnerPokemonName = winnerIs1 ? pokemon1.name : pokemon2.name;

  return {
    trainer1Id,
    trainer2Id,
    pokemon1Id: pokemon1.id,
    pokemon2Id: pokemon2.id,
    pokemon1Name: pokemon1.name,
    pokemon2Name: pokemon2.name,
    winnerTrainerId,
    winnerPokemonId,
    winnerPokemonName,
    log,
  };
};
