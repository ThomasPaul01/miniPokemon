import pool from "../config/database";

export const getAllAttacks = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM attacks');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const createAttack = async (name: string, damage: number, limitUse: number, pokemonId: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO attacks (name, damage, limit_use, pokemon_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, damage, limitUse, pokemonId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
