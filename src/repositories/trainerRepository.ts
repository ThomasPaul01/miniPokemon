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
