import pool from './database';

export const loadFixtures = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Nettoyer les données existantes
        console.log('🧹 Cleaning existing data...');
        await client.query('TRUNCATE TABLE attacks, trainer_pokemons, pokemons, trainers RESTART IDENTITY CASCADE');

        // Créer des trainers
        console.log('👤 Creating trainers...');
        const trainersResult = await client.query(`
            INSERT INTO trainers (name, level, experience) VALUES
            ('Sacha', 50, 10000),
            ('Ondine', 35, 5000),
            ('Pierre', 40, 7500),
            ('Flora', 30, 4000),
            ('Régis', 45, 8500)
            RETURNING id, name
        `);
        console.log(`✅ Created ${trainersResult.rows.length} trainers`);

        // Créer des pokémons
        console.log('🔴 Creating pokemons...');
        const pokemonsResult = await client.query(`
            INSERT INTO pokemons (name, life_points) VALUES
            ('Pikachu', 100),
            ('Bulbizarre', 120),
            ('Salamèche', 110),
            ('Carapuce', 115),
            ('Chenipan', 80),
            ('Roucool', 90),
            ('Rattata', 75),
            ('Mewtwo', 200),
            ('Dracaufeu', 180),
            ('Tortank', 170),
            ('Florizarre', 165),
            ('Ronflex', 250),
            ('Évoli', 105),
            ('Magicarpe', 50),
            ('Léviator', 190)
            RETURNING id, name
        `);
        console.log(`✅ Created ${pokemonsResult.rows.length} pokemons`);

        // Associer des pokémons aux trainers
        console.log('🔗 Linking pokemons to trainers...');
        await client.query(`
            INSERT INTO trainer_pokemons (trainer_id, pokemon_id) VALUES
            (1, 1),  -- Sacha a Pikachu
            (1, 2),  -- Sacha a Bulbizarre
            (1, 9),  -- Sacha a Dracaufeu
            (2, 4),  -- Ondine a Carapuce
            (2, 10), -- Ondine a Tortank
            (2, 14), -- Ondine a Magicarpe
            (3, 6),  -- Pierre a Roucool
            (3, 12), -- Pierre a Ronflex
            (4, 11), -- Flora a Florizarre
            (4, 13), -- Flora a Évoli
            (5, 8),  -- Régis a Mewtwo
            (5, 15)  -- Régis a Léviator
        `);
        console.log('✅ Linked pokemons to trainers');

        // Créer des attaques pour chaque pokémon
        console.log('⚡ Creating attacks...');
        const attacksResult = await client.query(`
            INSERT INTO attacks (name, damage, limit_use, pokemon_id) VALUES
            -- Attaques de Pikachu (pokemon_id = 1)
            ('Éclair', 40, 25, 1),
            ('Tonnerre', 90, 15, 1),
            ('Cage-Éclair', 20, 20, 1),
            
            -- Attaques de Bulbizarre (pokemon_id = 2)
            ('Fouet Lianes', 45, 25, 2),
            ('Lance-Soleil', 120, 10, 2),
            ('Poudre Toxik', 30, 35, 2),
            
            -- Attaques de Salamèche (pokemon_id = 3)
            ('Flammèche', 40, 25, 3),
            ('Lance-Flammes', 90, 15, 3),
            ('Crocs Feu', 65, 15, 3),
            
            -- Attaques de Carapuce (pokemon_id = 4)
            ('Pistolet à O', 40, 25, 4),
            ('Hydrocanon', 110, 5, 4),
            ('Morsure', 60, 25, 4),
            
            -- Attaques de Mewtwo (pokemon_id = 8)
            ('Psyko', 90, 10, 8),
            ('Déflagration', 110, 5, 8),
            ('Fatal-Foudre', 110, 5, 8),
            
            -- Attaques de Dracaufeu (pokemon_id = 9)
            ('Dracochoc', 85, 10, 9),
            ('Déflagration', 110, 5, 9),
            ('Vol', 90, 15, 9),
            
            -- Attaques de Ronflex (pokemon_id = 12)
            ('Plaquage', 85, 15, 12),
            ('Repos', 0, 10, 12),
            ('Ronflement', 50, 15, 12),
            
            -- Attaques de Magicarpe (pokemon_id = 14)
            ('Trempette', 0, 40, 14),
            ('Charge', 40, 35, 14)
            
            RETURNING id, name
        `);
        console.log(`✅ Created ${attacksResult.rows.length} attacks`);

        await client.query('COMMIT');
        
        console.log('\n🎉 Fixtures loaded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${trainersResult.rows.length} trainers`);
        console.log(`   - ${pokemonsResult.rows.length} pokemons`);
        console.log(`   - ${attacksResult.rows.length} attacks`);
        console.log(`   - 12 trainer-pokemon relationships\n`);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error loading fixtures:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Si le fichier est exécuté directement
if (require.main === module) {
    import('dotenv').then(dotenv => {
        dotenv.config();
        loadFixtures()
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
