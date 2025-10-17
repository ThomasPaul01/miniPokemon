import pool from "../config/database";
export const getAllTrainers = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM trainers');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }   
};
export const createTrainer = async (name: string, level: number, experience: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO trainers (name, level, experience) VALUES ($1, $2, $3) RETURNING *',
            [name, level, experience]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

//addPokemon pas encore fonctionnel
export const addPokemonToTrainer = async (trainerId: number, pokemonId: number) => {
    const client = await pool.connect();
    try {
        // Vérifier que le trainer existe
        const trainerCheck = await client.query(
            'SELECT id FROM trainers WHERE id = $1',
            [trainerId]
        );
        if (trainerCheck.rows.length === 0) {
            throw new Error(`Trainer with id ${trainerId} not found`);
        }

        // Vérifier que le pokémon existe
        const pokemonCheck = await client.query(
            'SELECT id FROM pokemons WHERE id = $1',
            [pokemonId]
        );
        if (pokemonCheck.rows.length === 0) {
            throw new Error(`Pokemon with id ${pokemonId} not found`);
        }

        // Ajouter la relation dans la table trainer_pokemons
        const result = await client.query(
            `INSERT INTO trainer_pokemons (trainer_id, pokemon_id) 
             VALUES ($1, $2) 
             ON CONFLICT (trainer_id, pokemon_id) 
             DO UPDATE SET captured_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [trainerId, pokemonId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const getTrainerPokemons = async (trainerId: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT p.*, tp.captured_at
             FROM pokemons p
             INNER JOIN trainer_pokemons tp ON p.id = tp.pokemon_id
             WHERE tp.trainer_id = $1
             ORDER BY tp.captured_at DESC`,
            [trainerId]
        );
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
