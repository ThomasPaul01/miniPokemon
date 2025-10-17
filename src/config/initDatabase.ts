import pool from './database';

export const initDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create tables if they do not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS trainers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                level INT NOT NULL,
                experience INT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS pokemons (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                life_points INT NOT NULL,
                trainer_id INT REFERENCES trainers(id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS attacks (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                damage INT NOT NULL,
                limit_use INT NOT NULL,
                pokemon_id INT REFERENCES pokemons(id)
            );
        `);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
