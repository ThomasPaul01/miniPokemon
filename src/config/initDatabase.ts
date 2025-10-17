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
                life_points INT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS trainer_pokemons (
                id SERIAL PRIMARY KEY,
                trainer_id INT NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
                pokemon_id INT NOT NULL REFERENCES pokemons(id) ON DELETE CASCADE,
                captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(trainer_id, pokemon_id)
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
        console.log('✅ Database tables created successfully!');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Si le fichier est exécuté directement
if (require.main === module) {
    import('dotenv').then(dotenv => {
        dotenv.config();
        initDatabase()
            .then(() => {
                console.log('✅ Done!');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Failed:', error);
                process.exit(1);
            });
    });
}
