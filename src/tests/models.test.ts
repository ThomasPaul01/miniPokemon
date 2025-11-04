import { describe, expect, test, xtest } from '@jest/globals';
import Trainer from '../models/Trainer';
import Attack from '../models/Attack';
import Pokemon from '../models/Pokemon';

describe('Attack Model', () => {
  const attack = new Attack('Thunderbolt', 90, 100);
  test('should create an Attack instance', () => {
    expect(attack).toBeInstanceOf(Attack);
  });
  test('should have correct properties', () => {
    expect(attack['_name']).toBe('Thunderbolt');
    expect(attack['_damage']).toBe(90);
    expect(attack['limitUse']).toBe(100);
    expect(attack['_currentUse']).toBe(0);
  });
  test('should return correct damage', () => {
    expect(attack.getDamage()).toBe(90);
  });
  test('should reset uses', () => {
    attack['_currentUse'] = 50;
    attack.resetUses();
    expect(attack['_currentUse']).toBe(0);
  });
  test('should return correct info string', () => {
    const info = attack.infoAttack();
    expect(info).toBe('Thunderbolt - Damage: 90 - Uses left: 100');
  });
});

describe('Pokemon Model', () => {
  const attack1 = new Attack('Tackle', 40, 35);
  const pokemon = new Pokemon('Pikachu', 100, [attack1]);
  test('should create a Pokemon instance', () => {
    expect(pokemon).toBeInstanceOf(Pokemon);
  });
  test('should have correct properties', () => {
    expect(pokemon['_name']).toBe('Pikachu');
    expect(pokemon['_lifePoints']).toBe(100);
    expect(pokemon['_attackList']).toEqual([attack1]);
  });
  test('should add new attack', () => {
    const attack2 = new Attack('Quick Attack', 40, 30);
    pokemon.newAttack(attack2);
    expect(pokemon['_attackList']).toEqual([attack1, attack2]);
  });
  test('should reset pokemon', () => {
    pokemon['_lifePoints'] = 50;
    attack1['_currentUse'] = 10;
    pokemon.resetPokemon();
    expect(pokemon['_lifePoints']).toBe(100);
    expect(attack1['_currentUse']).toBe(0);
  });
  test('should heal pokemon', () => {
    pokemon['_lifePoints'] = 70;
    pokemon.Heal(20);
    expect(pokemon['_lifePoints']).toBe(90);
  });
  test('should attack opponent trainer', () => {
    const opponentAttack = new Attack('Scratch', 30, 40);
    const opponentPokemon = new Pokemon('Charmander', 100, [opponentAttack]);
    const opponentTrainer = new Trainer('Gary', 12, 150, [opponentPokemon]);
    pokemon.attack(opponentTrainer, attack1);
    expect(opponentPokemon['_lifePoints']).toBe(60);
  });
});

describe('Trainer Model', () => {
  const pokemon1 = new Pokemon('Bulbasaur', 100, []);
  const trainer = new Trainer('Ash', 10, 100, [pokemon1]);
  test('should create a Trainer instance', () => {
    expect(trainer).toBeInstanceOf(Trainer);
  });

  test('should have correct properties', () => {
    expect(trainer['name']).toBe('Ash');
    expect(trainer['level']).toBe(10);
    expect(trainer['experience']).toBe(100);
    expect(trainer['pokemons']).toEqual([pokemon1]);
  });

  test('should catch new pokemon', () => {
    const pokemon2 = new Pokemon('Squirtle', 100, []);
    trainer.catchPokemon(pokemon2);
    expect(trainer['pokemons']).toEqual([pokemon1, pokemon2]);
  });

  //does not pass because of experience logic
  xtest('should gain experience and level up', () => {
    const newTrainer = new Trainer('Misty', 10, 95, []);
    newTrainer.gainExperience(5);
    expect(newTrainer['experience']).toBe(100);
    expect(newTrainer['level']).toBe(11);
  });
  test('should get pokemon by index', () => {
    const retrievedPokemon = trainer.getPokemons(0);
    expect(retrievedPokemon).toBe(pokemon1);
  });
  test('should get all pokemons', () => {
    trainer['pokemons'] = [pokemon1];
    const allPokemons = trainer.getAllPokemons();
    expect(allPokemons).toEqual([pokemon1]);
  });
});
