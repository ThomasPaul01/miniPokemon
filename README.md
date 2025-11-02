# Mini Pokemon API

## 🚀 Commandes

### Lancer le serveur
```bash
npm run start
```

### Charger les fixtures (données de test)
```bash
npm run db:fixtures
```

## 🌐 Route par défaut

Une fois le serveur lancé, accédez à l'application :

**http://localhost:3000/public/index.html**

## 📋 Fonctionnalités

- **Listes** : Afficher tous les dresseurs, pokémons et attaques
- **Créer** : Ajouter de nouveaux dresseurs, pokémons et attaques
- **Taverne** : Soigner tous les pokémons d'un dresseur (PV + usages d'attaques)
- **Combat** : 
  - Attaque simple entre deux pokémons
  - Duel aléatoire (avec choix du nombre de rounds)
  - Duel déterministe (le pokémon avec le plus de PV, avec choix du nombre de rounds)
