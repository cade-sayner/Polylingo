import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import 'dotenv/config'

const app = express();
const port = 3000;

registerUserRoutes(app);
registerAuthRoutes(app);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

