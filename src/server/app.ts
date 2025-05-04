import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import { clientRoutes } from "./lib/constants";
import 'dotenv/config'
import path from 'path';

const app = express();
const port = 3000;

registerUserRoutes(app);
registerAuthRoutes(app);

const publicDir = path.join(__dirname, '..', 'public');

// this needs to eventually just return index.html for any known route on the client side
app.get(clientRoutes, (_req, res) => {
  res.sendFile('index.html', { root: publicDir });
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

