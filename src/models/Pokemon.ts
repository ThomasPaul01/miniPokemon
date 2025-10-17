class Pokemon {
    private _name: string;
    private _lifePoints: number;
    private _attackList: Attack[];

    constructor(name: string, lifePoints: number, attackList: Attack[]) {
        this._name = name;
        this._lifePoints = lifePoints;
        this._attackList = attackList;
    }

    public newAttack(attack: Attack): void {
        this._attackList.push(attack);
    }

    public resetPokemon(): void {
        this._lifePoints = 100;
        this._attackList.forEach(element => {
            element.resetUses();
        });
    }

    public Heal(points: number): void {
        this._lifePoints += points;
    }

    public attack(opponent: Trainer, attack: Attack): void {
        const randomIndex = Math.floor(Math.random() * opponent.getAllPokemons().length);
        const targetedPokemon = opponent.getPokemons(randomIndex);
        targetedPokemon.Heal(-attack.getDamage());
    }

}
