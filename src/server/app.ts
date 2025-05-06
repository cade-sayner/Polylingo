import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import { registerTranslationQuestionsRoutes } from './handlers/translation-questions-handlers';
import { clientRoutes } from "./lib/constants";
import 'dotenv/config'
import path from 'path';

const app = express();
const port = 3000;

registerUserRoutes(app);
registerAuthRoutes(app);
registerTranslationQuestionsRoutes(app);

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static('public'));
// Anything else must just return index.html
app.use(/(.*)/, (_req, res) => {
  res.sendFile('index.html', { root: publicDir });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

