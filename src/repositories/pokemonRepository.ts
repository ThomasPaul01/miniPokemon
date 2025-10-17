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
export const createPokemon = async (name: string, lifePoints: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO pokemons (name, life_points) VALUES ($1, $2) RETURNING *',
            [name, lifePoints]
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
//Un Pokémon peut apprendre une attaque (max 4 attaques, sans doublon)
export const teachAttackToPokemon = async (pokemonId: number, attackId: number, limitUse: number) => {
    const client = await pool.connect();
    try {
        // Vérifier que le pokémon n'a pas déjà 4 attaques
        const countResult = await client.query(
            'SELECT COUNT(*) as count FROM pokemon_attacks WHERE pokemon_id = $1',
            [pokemonId]
        );
        if (parseInt(countResult.rows[0].count) >= 4) {
            throw new Error('Pokemon already knows 4 attacks (maximum reached)');
        }

        // Ajouter l'attaque avec remaining_uses initialisé
        const result = await client.query(
            `INSERT INTO pokemon_attacks (pokemon_id, attack_id, remaining_uses) 
             VALUES ($1, $2, $3) RETURNING *`,
            [pokemonId, attackId, limitUse]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

// se soigner (restaure ses PV et réinitialise les usages de ses attaques)
export const healPokemon = async (pokemonId: number) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Restaurer les PV (on suppose qu'il y a current_life_points, sinon life_points reste inchangé)
        await client.query(
            `UPDATE pokemons SET life_points = 100 WHERE id = $1`,
            [pokemonId]
        );
        
        // Réinitialiser les usages des attaques - récupérer limit_use depuis attacks
        await client.query(
            `UPDATE pokemon_attacks pa 
             SET remaining_uses = a.limit_use 
             FROM attacks a 
             WHERE pa.attack_id = a.id AND pa.pokemon_id = $1`,
            [pokemonId]
        );
        
        await client.query('COMMIT');
        
        const result = await client.query(
            'SELECT * FROM pokemons WHERE id = $1',
            [pokemonId]
        );
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
//attaquer un autre Pokémon de façon aléatoire avec l’une de ses attaques disponibles
export const attackPokemon = async (attackerId: number, defenderId: number) => {
    const client = await pool.connect();
    try {
        // Récupérer une attaque aléatoire de l'attaquant
        const attackResult = await client.query(
            `SELECT a.id, a.damage FROM attacks a
            JOIN pokemon_attacks pa ON a.id = pa.attack_id
            WHERE pa.pokemon_id = $1
            ORDER BY RANDOM() LIMIT 1`,
            [attackerId]
        );
        if (attackResult.rows.length === 0) {
            throw new Error(`No attacks found for pokemon with id ${attackerId}`);
        }
        const attack = attackResult.rows[0];
        // Infliger les dégâts au défenseur
        const defenderResult = await client.query(
            `UPDATE pokemons SET life_points = GREATEST(life_points - $1, 0) WHERE id = $2 RETURNING *`,
            [attack.damage, defenderId]
        );
        return {
            attack,
            defender: defenderResult.rows[0]
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
