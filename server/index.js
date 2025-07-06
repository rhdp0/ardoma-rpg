import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
const characters = new Map();
let currentId = 1;

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }
  // Fake token generation for demo
  const token = `token-${Date.now()}`;
  res.json({ token });
});

app.post('/characters', (req, res) => {
  const character = { id: currentId++, ...req.body };
  characters.set(character.id, character);
  res.status(201).json(character);
});

app.get('/characters/:id', (req, res) => {
  const char = characters.get(Number(req.params.id));
  if (!char) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json(char);
});

// Simple campaign oracle
const campaignHooks = [
  'A guild seeks brave adventurers',
  'Um artefato poderoso foi perdido',
  'Uma nova ameaça surge nas sombras'
];

app.get('/oracles/campaign', (req, res) => {
  const hook = campaignHooks[Math.floor(Math.random() * campaignHooks.length)];
  res.json({ hook });
});

const soloPrompts = [
  'Um aliado inesperado aparece',
  'Encontre uma pista misteriosa',
  'Um inimigo revela seu plano'
];

app.get('/oracles/masterless', (req, res) => {
  const prompt = soloPrompts[Math.floor(Math.random() * soloPrompts.length)];
  res.json({ prompt });
});

app.get('/dice/:sides/:count?', (req, res) => {
  const sides = parseInt(req.params.sides, 10) || 6;
  const count = parseInt(req.params.count, 10) || 1;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(1 + Math.floor(Math.random() * sides));
  }
  res.json({ sides, count, rolls });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
