class Attack {
    private _name: string;
    private _damage: number;
    private limitUse: number;
    private _currentUse: number;

    constructor(name: string, damage: number, limitUse: number) {
        this._name = name;
        this._damage = damage;
        this.limitUse = limitUse;
        this._currentUse = 0;
    }

    public getDamage(): number {
        return this._damage;
    }

    public resetUses(): void {
        this._currentUse = 0;
    }

    public infoAttack(): string {
        return `${this._name} - Damage: ${this._damage} - Uses left: ${this.limitUse - this._currentUse}`;
    }
 
}
