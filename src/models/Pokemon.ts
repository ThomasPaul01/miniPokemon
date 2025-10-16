class Pokemon {
    private _name: string;
    private _lifePoints: number;
    private _attackList: string[];

    constructor(name: string, lifePoints: number, attackList: string[]) {
        this._name = name;
        this._lifePoints = lifePoints;
        this._attackList = attackList;
    }

    public newAttack(attack: string): void {
        this._attackList.push(attack);
    }

    public maxHeal(points: number): void {
        this._lifePoints += points;
    }

    public attack(): string {
        const randomIndex = Math.floor(Math.random() * this._attackList.length);
        return this._attackList[randomIndex];
    }

}
