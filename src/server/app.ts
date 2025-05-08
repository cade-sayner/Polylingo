import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import { registerTranslationQuestionsRoutes } from './handlers/translation-questions-handlers';
import { clientRoutes } from "./lib/constants";
import { hasKeys } from './lib/type-helpers';
import 'dotenv/config'
import path from 'path';
import { registerFillBlankRoutes } from './handlers/fill-blank-handlers';

const app = express();
const port = 3000;


if(!hasKeys(process.env, [
  {name: "GOOGLE_CLIENT_ID", type:"string" },
  {name: "GOOGLE_CLIENT_SECRET", type:"string"}, 
  {name: "REDIRECT_URI", type:"string" }
]))
throw new Error("Environment variables have not been set correctly");


registerUserRoutes(app);
registerAuthRoutes(app);
registerTranslationQuestionsRoutes(app
registerFillBlankRoutes(app);

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static('public', {extensions : ["js"]}));
// Anything else must just return index.html
app.use(/(.*)/, (_req, res) => {
  res.sendFile('index.html', { root: publicDir });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

