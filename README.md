1. Mini Pokemon
Créer une API REST en Express + TypeScript, connectée à une base de données (PostgreSQL), permettant de gérer un système de jeu Pokémon simplifié.
L’objectif est d’appliquer les principes de la programmation orientée objet (POO) à travers des classes, des relations et des interactions entre objets.

 
Gestion des Pokémon
 

Chaque Pokémon possède :

- un nom
- des points de vie (lifePoint)
- une liste d’attaques
 
Un Pokémon peut :

- apprendre une attaque (max 4 attaques, sans doublon)
- se soigner (restaure ses PV et réinitialise les usages de ses attaques)
- attaquer un autre Pokémon de façon aléatoire avec l’une de ses attaques disponibles
 
Gestion des Attaques
 

Une attaque possède :

- un nom
- des dégâts (damage)
- une limite d’usage (usageLimit)
- un compteur d’usage qui s’incrémente à chaque utilisation
 
Une méthode permet d’afficher ses informations sous forme lisible.

 

Gestion des Dresseurs
 

Un dresseur possède :

- un nom
- un niveau (level)
- une expérience (experience)
une liste de Pokémon

 

Il peut :

 

- ajouter un Pokémon
- soigner tous ses Pokémon à la taverne
- gagner de l’expérience (et augmenter de niveau lorsque l’expérience atteint 10)
 

Implémentez différentes méthodes de combat :

 

Défi aléatoire :
Deux dresseurs soignent leurs Pokémon, choisissent un Pokémon aléatoire et combattent jusqu’à ce qu’un des deux perde tous ses PV.

 

Arène 1 :
100 combats aléatoires successifs — le dresseur avec le plus haut niveau (ou expérience en cas d’égalité) gagne.

 

Défi déterministe :
Chaque dresseur choisit son Pokémon avec le plus de PV, combat sans taverne.

 

Arène 2 :
100 combats déterministes consécutifs, arrêt si un dresseur perd tous ses Pokémon.

fixtures: npm run db:fixtures