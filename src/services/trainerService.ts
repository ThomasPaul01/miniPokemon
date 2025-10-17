
import { getAllTrainers, createTrainer, addPokemonToTrainer} from "../repositories/trainerRepository";

export const listAllTrainers = async () => {
    return await getAllTrainers();
}   
export const createNewTrainer = async (name: string, level: number, experience: number) => {
    return await createTrainer(name, level, experience);
}
export const addNewPokemonToTrainer = async (trainerId: number, pokemonId: number) => {
    return await addPokemonToTrainer(trainerId, pokemonId);
}   