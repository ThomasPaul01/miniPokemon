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

export const createAttack = async (name: string, damage: number, limitUse: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO attacks (name, damage, limit_use) VALUES ($1, $2, $3) RETURNING *',
            [name, damage, limitUse]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
