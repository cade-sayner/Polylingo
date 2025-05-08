import express from 'express';
import { registerUserRoutes } from './handlers/user-handlers';
import { registerAuthRoutes } from './handlers/auth-handlers';
import { registerTranslationAuditRoutes } from './handlers/translations-audit-handlers';
import { registerFillBlankAuditRoutes } from './handlers/fill-blank-audit-handlers';
import { clientRoutes } from "./lib/constants";
import 'dotenv/config'
import path from 'path';
const app = express();
app.use(express.json());
const port = 3000;

registerUserRoutes(app);
registerAuthRoutes(app);
registerTranslationAuditRoutes(app);
registerFillBlankAuditRoutes(app)

const publicDir = path.join(__dirname, '..', 'public');

app.use(express.static('public'));
// Anything else must just return index.html
app.use(/(.*)/, (_req, res) => {
  res.sendFile('index.html', { root: publicDir });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

