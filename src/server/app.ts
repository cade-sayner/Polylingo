import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import { registerTranslationAuditRoutes } from './handlers/translations-audit-handlers';
import { registerFillBlankAuditRoutes } from './handlers/fill-blank-audit-handlers';
import { registerWordRoutes } from './handlers/word-handlers';
import 'dotenv/config'
import path from 'path';
import { registerFillBlankRoutes } from './handlers/fill-blank-handlers';
import { hasKeys } from './lib/type-helpers';
import { registerTranslationQuestionsRoutes } from './handlers/translation-questions-handlers';
import {registerLanguageRoutes} from "./handlers/language-handlers";

const app = express();
app.use(express.json());
const port = 3000;


if(!hasKeys(process.env, [
  {name: "GOOGLE_CLIENT_ID_SHAY", type:"string" },
  {name: "GOOGLE_CLIENT_SECRET_SHAY", type:"string"}, 
  {name: "REDIRECT_URI_SHAY", type:"string" }
]))
throw new Error("Environment variables have not been set correctly");


registerUserRoutes(app);
registerAuthRoutes(app);
registerTranslationAuditRoutes(app);
registerFillBlankAuditRoutes(app)
registerTranslationQuestionsRoutes(app);
registerFillBlankRoutes(app);
registerLanguageRoutes(app);
registerWordRoutes(app);

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static('public', {extensions : ["js"]}));
// Anything else must just return index.html
app.use(/(.*)/, (_req, res) => {
  res.sendFile('index.html', { root: publicDir });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

