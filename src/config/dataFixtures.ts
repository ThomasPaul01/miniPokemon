import pool from './database';

export const loadFixtures = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Nettoyer les données existantes
    console.log('🧹 Cleaning existing data...');
    await client.query(
      'TRUNCATE TABLE pokemon_attacks, attacks, trainer_pokemons, pokemons, trainers RESTART IDENTITY CASCADE',
    );

    // Créer des trainers
    console.log('👤 Creating trainers...');
    const trainersResult = await client.query(`
            INSERT INTO trainers (name, level, experience) VALUES
            ('Sacha', 50, 10000),
            ('Ondine', 35, 5000),
            ('Pierre', 40, 7500)
            RETURNING id, name
        `);
    console.log(`✅ Created ${trainersResult.rows.length} trainers`);

    // Créer des pokémons
    console.log('🔴 Creating pokemons...');
    const pokemonsResult = await client.query(`
            INSERT INTO pokemons (name, life_points) VALUES
            ('Pikachu', 100),
            ('Bulbizarre', 100),
            ('Salamèche', 100),
            ('Carapuce', 100),
            ('Ronflex', 100),
            ('Mewtwo', 100)
            RETURNING id, name
        `);
    console.log(`✅ Created ${pokemonsResult.rows.length} pokemons`);

    // Associer des pokémons aux trainers
    console.log('🔗 Linking pokemons to trainers...');
    await client.query(`
            INSERT INTO trainer_pokemons (trainer_id, pokemon_id) VALUES
            (1, 1),  -- Sacha a Pikachu
            (1, 2),  -- Sacha a Bulbizarre
            (2, 3),  -- Ondine a Salamèche
            (2, 4),  -- Ondine a Carapuce
            (3, 5),  -- Pierre a Ronflex
            (3, 6)   -- Pierre a Mewtwo
        `);
    console.log('✅ Linked pokemons to trainers');

    // Créer des attaques (catalogue global)
    console.log('⚡ Creating attacks catalog...');
    const attacksResult = await client.query(`
            INSERT INTO attacks (name, damage, limit_use) VALUES
            ('Éclair', 15, 20),
            ('Tonnerre', 25, 10),
            ('Fouet Lianes', 15, 20),
            ('Lance-Soleil', 30, 10),
            ('Flammèche', 15, 20),
            ('Lance-Flammes', 25, 10),
            ('Pistolet à O', 15, 20),
            ('Hydrocanon', 30, 10),
            ('Plaquage', 20, 15),
            ('Psyko', 25, 10)
            RETURNING id, name
        `);
    console.log(`✅ Created ${attacksResult.rows.length} attacks`);

    // Associer les attaques aux pokémons via pokemon_attacks
    console.log('🎯 Teaching attacks to pokemons...');
    await client.query(`
            INSERT INTO pokemon_attacks (pokemon_id, attack_id, remaining_uses) VALUES
            -- Pikachu (pokemon_id = 1) - attaques électriques
            (1, 1, 20),  -- Éclair
            (1, 2, 10),  -- Tonnerre
            (1, 9, 15),  -- Plaquage
            
            -- Bulbizarre (pokemon_id = 2) - attaques plante
            (2, 3, 20),  -- Fouet Lianes
            (2, 4, 10),  -- Lance-Soleil
            (2, 9, 15),  -- Plaquage
            
            -- Salamèche (pokemon_id = 3) - attaques feu
            (3, 5, 20),  -- Flammèche
            (3, 6, 10),  -- Lance-Flammes
            (3, 9, 15),  -- Plaquage
            
            -- Carapuce (pokemon_id = 4) - attaques eau
            (4, 7, 20),  -- Pistolet à O
            (4, 8, 10),  -- Hydrocanon
            (4, 9, 15),  -- Plaquage
            
            -- Ronflex (pokemon_id = 5) - attaques normales
            (5, 9, 15),  -- Plaquage
            (5, 1, 20),  -- Éclair
            (5, 7, 20),  -- Pistolet à O
            
            -- Mewtwo (pokemon_id = 6) - attaques psy
            (6, 10, 10), -- Psyko
            (6, 2, 10),  -- Tonnerre
            (6, 4, 10)   -- Lance-Soleil
        `);
    console.log('✅ Taught attacks to pokemons');

    await client.query('COMMIT');

    console.log('\n🎉 Fixtures loaded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${trainersResult.rows.length} trainers`);
    console.log(`   - ${pokemonsResult.rows.length} pokemons`);
    console.log(`   - ${attacksResult.rows.length} attacks`);
    console.log(`   - 6 trainer-pokemon relationships`);
    console.log(`   - All pokemons have 3 attacks each\n`);
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
  import('dotenv').then((dotenv) => {
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
