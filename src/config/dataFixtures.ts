import pool from './database';

export const loadFixtures = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Nettoyer les données existantes
        console.log('🧹 Cleaning existing data...');
        await client.query('TRUNCATE TABLE pokemon_attacks, attacks, trainer_pokemons, pokemons, trainers RESTART IDENTITY CASCADE');

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

        // Créer des attaques (catalogue global) - dégâts réduits de 3x pour des combats plus longs
        console.log('⚡ Creating attacks catalog...');
        const attacksResult = await client.query(`
            INSERT INTO attacks (name, damage, limit_use) VALUES
            -- Attaques électriques
            ('Éclair', 13, 25),
            ('Tonnerre', 30, 15),
            ('Cage-Éclair', 7, 20),
            
            -- Attaques plante
            ('Fouet Lianes', 15, 25),
            ('Lance-Soleil', 40, 10),
            ('Poudre Toxik', 10, 35),
            
            -- Attaques feu
            ('Flammèche', 13, 25),
            ('Lance-Flammes', 30, 15),
            ('Crocs Feu', 22, 15),
            ('Déflagration', 37, 5),
            
            -- Attaques eau
            ('Pistolet à O', 13, 25),
            ('Hydrocanon', 37, 5),
            
            -- Attaques normales
            ('Morsure', 20, 25),
            ('Plaquage', 28, 15),
            ('Charge', 13, 35),
            
            -- Attaques psy
            ('Psyko', 30, 10),
            ('Fatal-Foudre', 37, 5),
            
            -- Attaques dragon/vol
            ('Dracochoc', 28, 10),
            ('Vol', 30, 15),
            
            -- Attaques spéciales
            ('Repos', 0, 10),
            ('Ronflement', 17, 15),
            ('Trempette', 0, 40)
            
            RETURNING id, name
        `);
        console.log(`✅ Created ${attacksResult.rows.length} attacks`);
        
        // Associer les attaques aux pokémons via pokemon_attacks
        console.log('🎯 Teaching attacks to pokemons...');
        await client.query(`
            INSERT INTO pokemon_attacks (pokemon_id, attack_id, remaining_uses) VALUES
            -- Pikachu (pokemon_id = 1) apprend 3 attaques électriques
            (1, 1, 25),  -- Éclair
            (1, 2, 15),  -- Tonnerre
            (1, 3, 20),  -- Cage-Éclair
            
            -- Bulbizarre (pokemon_id = 2) apprend 3 attaques plante
            (2, 4, 25),  -- Fouet Lianes
            (2, 5, 10),  -- Lance-Soleil
            (2, 6, 35),  -- Poudre Toxik
            
            -- Salamèche (pokemon_id = 3) apprend 3 attaques feu
            (3, 7, 25),  -- Flammèche
            (3, 8, 15),  -- Lance-Flammes
            (3, 9, 15),  -- Crocs Feu
            
            -- Carapuce (pokemon_id = 4) apprend 3 attaques eau/normal
            (4, 11, 25), -- Pistolet à O
            (4, 12, 5),  -- Hydrocanon
            (4, 13, 25), -- Morsure
            
            -- Mewtwo (pokemon_id = 8) apprend 3 attaques puissantes
            (8, 16, 10), -- Psyko
            (8, 10, 5),  -- Déflagration
            (8, 17, 5),  -- Fatal-Foudre
            
            -- Dracaufeu (pokemon_id = 9) apprend 3 attaques feu/vol
            (9, 18, 10), -- Dracochoc
            (9, 10, 5),  -- Déflagration
            (9, 19, 15), -- Vol
            
            -- Ronflex (pokemon_id = 12) apprend 3 attaques
            (12, 14, 15), -- Plaquage
            (12, 20, 10), -- Repos
            (12, 21, 15), -- Ronflement
            
            -- Magicarpe (pokemon_id = 14) apprend 2 attaques
            (14, 22, 40), -- Trempette
            (14, 15, 35)  -- Charge
        `);
        console.log('✅ Taught attacks to pokemons');

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
