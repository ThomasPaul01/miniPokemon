import { createAttack, getAllAttacks } from "../repositories/attackRepository";

export const createNewAttack = async (name: string, damage: number, limitUse: number, pokemonId: number) => {
    return await createAttack(name, damage, limitUse, pokemonId);
};

export const listAllAttacks = async () => {
    return await getAllAttacks();
}