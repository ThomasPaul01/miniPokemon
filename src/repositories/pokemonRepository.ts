import pool from "../config/database";
export const getAllPokemons = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM pokemons');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
export const createPokemon = async (name: string, lifePoints: number, trainerId: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO pokemons (name, life_points, trainer_id) VALUES ($1, $2, $3) RETURNING *',
            [name, lifePoints, trainerId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
export const getPokemonsByTrainerId = async (trainerId: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM pokemons WHERE trainer_id = $1',
            [trainerId]
        );
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }      
};