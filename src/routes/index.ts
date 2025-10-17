import express, { Request, Response, NextFunction } from 'express'
import trainerRoutes from './trainerRoutes.ts';
const app = express()
const port = 3000


app.use(express.json()); 
app.use(logger);        

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/trainers', trainerRoutes);

function logger(req: Request, _res: Response, next: NextFunction) {
  console.log('\n--- headerLogger: request.headers ---');
  console.log(req.headers);
  console.log('--- end headers ---\n');
  next();
}
export default app;