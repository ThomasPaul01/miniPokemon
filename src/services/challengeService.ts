import { getPokemonsByTrainerId, healPokemon, attackPokemon } from "../repositories/pokemonRepository";
import { addExperienceToTrainer } from "../repositories/trainerRepository";

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

export interface BattlesSummary {
  rounds: number;
  wins1: number;
  wins2: number;
}

export interface MultiBattleResult {
  summary: BattlesSummary;
  battles: BattleResult[];
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

    if (defenderAfter <= 0) {
      // Pokemon mort : donner 50 XP au trainer gagnant
      await addExperienceToTrainer(attacker.trainerId, 50);
      break;
    }

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

export const deterministicDuel = async (trainer1Id: number, trainer2Id: number): Promise<BattleResult> => {
  if (!trainer1Id || !trainer2Id) {
    throw new Error("trainer1Id and trainer2Id are required");
  }

  // Récupérer les pokémons des deux dresseurs
  const pokemons1 = await getPokemonsByTrainerId(trainer1Id);
  const pokemons2 = await getPokemonsByTrainerId(trainer2Id);

  if (!pokemons1.length) throw new Error(`Trainer ${trainer1Id} has no pokemons`);
  if (!pokemons2.length) throw new Error(`Trainer ${trainer2Id} has no pokemons`);

  // Choisir le pokémon avec le plus de PV pour chaque dresseur (SANS SOIGNER)
  const pokemon1 = pokemons1.reduce((best: any, current: any) => 
    current.life_points > best.life_points ? current : best
  );
  const pokemon2 = pokemons2.reduce((best: any, current: any) => 
    current.life_points > best.life_points ? current : best
  );

  let attacker = { trainerId: trainer1Id, pokemonId: pokemon1.id };
  let defender = { trainerId: trainer2Id, pokemonId: pokemon2.id };

  let life1 = Number(pokemon1.life_points);
  let life2 = Number(pokemon2.life_points);
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

    if (defenderAfter <= 0) {
      // Pokemon mort : donner 50 XP au trainer gagnant
      await addExperienceToTrainer(attacker.trainerId, 50);
      break;
    }

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

export const randomDuelRounds = async (
  trainer1Id: number,
  trainer2Id: number,
  rounds: number
): Promise<MultiBattleResult> => {
  const battles: BattleResult[] = [];
  let wins1 = 0;
  let wins2 = 0;

  for (let i = 0; i < rounds; i++) {
    // Get pokemons and heal ALL before each round
    const pokemons1 = await getPokemonsByTrainerId(trainer1Id);
    const pokemons2 = await getPokemonsByTrainerId(trainer2Id);
    if (!pokemons1.length) throw new Error(`Trainer ${trainer1Id} has no pokemons`);
    if (!pokemons2.length) throw new Error(`Trainer ${trainer2Id} has no pokemons`);

    // Heal ALL pokemons (HP + remaining_uses reset)
    await Promise.all(pokemons1.map((p: any) => healPokemon(p.id)));
    await Promise.all(pokemons2.map((p: any) => healPokemon(p.id)));

    // Choose random pokemon
    const pokemon1 = pokemons1[Math.floor(Math.random() * pokemons1.length)];
    const pokemon2 = pokemons2[Math.floor(Math.random() * pokemons2.length)];

    let attacker = { trainerId: trainer1Id, pokemonId: pokemon1.id };
    let defender = { trainerId: trainer2Id, pokemonId: pokemon2.id };
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
      if (defender.pokemonId === pokemon1.id) life1 = defenderAfter; else life2 = defenderAfter;
      if (defenderAfter <= 0) {
        // Pokemon mort : donner 50 XP au trainer gagnant
        await addExperienceToTrainer(attacker.trainerId, 50);
        break;
      }
      const tmp = attacker; attacker = defender; defender = tmp; turn += 1;
    }

    const winnerIs1 = life1 > 0;
    const winnerTrainerId = winnerIs1 ? trainer1Id : trainer2Id;
    const winnerPokemonId = winnerIs1 ? pokemon1.id : pokemon2.id;
    const winnerPokemonName = winnerIs1 ? pokemon1.name : pokemon2.name;
    if (winnerIs1) wins1++; else wins2++;

    battles.push({
      trainer1Id, trainer2Id,
      pokemon1Id: pokemon1.id, pokemon2Id: pokemon2.id,
      pokemon1Name: pokemon1.name, pokemon2Name: pokemon2.name,
      winnerTrainerId, winnerPokemonId, winnerPokemonName,
      log,
    });
  }

  return { summary: { rounds, wins1, wins2 }, battles };
};

export const deterministicDuelRounds = async (
  trainer1Id: number,
  trainer2Id: number,
  rounds: number
): Promise<MultiBattleResult> => {
  const battles: BattleResult[] = [];
  let wins1 = 0;
  let wins2 = 0;

  for (let i = 0; i < rounds; i++) {
    // Get pokemons and heal ALL before each round
    const pokemons1 = await getPokemonsByTrainerId(trainer1Id);
    const pokemons2 = await getPokemonsByTrainerId(trainer2Id);
    if (!pokemons1.length) throw new Error(`Trainer ${trainer1Id} has no pokemons`);
    if (!pokemons2.length) throw new Error(`Trainer ${trainer2Id} has no pokemons`);

    // Heal ALL pokemons (HP + remaining_uses reset)
    await Promise.all(pokemons1.map((p: any) => healPokemon(p.id)));
    await Promise.all(pokemons2.map((p: any) => healPokemon(p.id)));

    // Choose pokemon with most HP (all at 100 after heal)
    const pokemon1 = pokemons1[0];
    const pokemon2 = pokemons2[0];

    let attacker = { trainerId: trainer1Id, pokemonId: pokemon1.id };
    let defender = { trainerId: trainer2Id, pokemonId: pokemon2.id };
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
      if (defender.pokemonId === pokemon1.id) life1 = defenderAfter; else life2 = defenderAfter;
      if (defenderAfter <= 0) {
        // Pokemon mort : donner 50 XP au trainer gagnant
        await addExperienceToTrainer(attacker.trainerId, 50);
        break;
      }
      const tmp = attacker; attacker = defender; defender = tmp; turn += 1;
    }

    const winnerIs1 = life1 > 0;
    const winnerTrainerId = winnerIs1 ? trainer1Id : trainer2Id;
    const winnerPokemonId = winnerIs1 ? pokemon1.id : pokemon2.id;
    const winnerPokemonName = winnerIs1 ? pokemon1.name : pokemon2.name;
    if (winnerIs1) wins1++; else wins2++;

    battles.push({
      trainer1Id, trainer2Id,
      pokemon1Id: pokemon1.id, pokemon2Id: pokemon2.id,
      pokemon1Name: pokemon1.name, pokemon2Name: pokemon2.name,
      winnerTrainerId, winnerPokemonId, winnerPokemonName,
      log,
    });
  }

  return { summary: { rounds, wins1, wins2 }, battles };
};
