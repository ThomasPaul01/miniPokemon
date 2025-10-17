
import { getAllTrainers, createTrainer} from "../repositories/trainerRepository";

export const listAllTrainers = async () => {
    return await getAllTrainers();
}   
export const createNewTrainer = async (name: string, level: number, experience: number) => {
    return await createTrainer(name, level, experience);
}