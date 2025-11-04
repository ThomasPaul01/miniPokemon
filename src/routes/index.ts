import express, { Request, Response, NextFunction } from 'express';
import trainerRoutes from './trainerRoutes.ts';
import pokemonRoutes from './pokemonRoutes.ts';
import attackRoutes from './attackRoutes.ts';
import challengeRoutes from './challengeRoutes.ts';
import tavernRoutes from './tavernRoutes.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(logger);

// Expose public folder for static files
app.use('/public', express.static(path.join(__dirname, '../../public')));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/trainers', trainerRoutes);
app.use('/pokemons', pokemonRoutes);
app.use('/attacks', attackRoutes);
app.use('/challenge', challengeRoutes);
app.use('/tavern', tavernRoutes);

function logger(req: Request, _res: Response, next: NextFunction) {
  console.log('\n--- headerLogger: request.headers ---');
  console.log(req.headers);
  console.log('--- end headers ---\n');
  next();
}
export default app;
