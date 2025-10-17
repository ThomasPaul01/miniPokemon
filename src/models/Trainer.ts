class Trainer {
    private name: string;
    private level: number;
    private experience: number;
    private pokemons: Pokemon[];

    constructor(name: string, level: number, experience: number, pokemons: Pokemon[]) {
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.pokemons = pokemons;
    }

    public catchPokemon(pokemon: Pokemon): void {
        this.pokemons.push(pokemon);
    }  

    public gainExperience(points: number): void {
        if (this.experience + points >= 10) {
            this.levelUp();
        }
    }

    private levelUp(): void {
        this.level += 1;
        this.experience = (this.experience + 1) - 10;
    }

    public getPokemons(index: number): Pokemon {
        return this.pokemons[index];
    }

    public getAllPokemons(): Pokemon[] {
        return this.pokemons;
    }  

}