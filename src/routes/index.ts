import express, { Request, Response, NextFunction } from 'express'
import trainerRoutes from './trainerRoutes.ts';
import pokemonRoutes from './pokemonRoutes.ts';
import attackRoutes from './attackRoutes.ts';

const path = require('path');
const app = express()


app.use(express.json()); 
app.use(logger);

// Expose public folder for static files
app.use('/public', express.static(path.join(__dirname, '../../public')));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/trainers', trainerRoutes);
app.use('/pokemons', pokemonRoutes);
app.use('/attacks', attackRoutes);

function logger(req: Request, _res: Response, next: NextFunction) {
  console.log('\n--- headerLogger: request.headers ---');
  console.log(req.headers);
  console.log('--- end headers ---\n');
  next();
}
export default app;