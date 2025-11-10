const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let items = [];
let idCounter = 1;

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const newItem = {
    id: idCounter++,
    title: req.body.title,
    description: req.body.description,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }
  
  items[itemIndex] = {
    ...items[itemIndex],
    ...req.body,
    id: itemId 
  };
  
  res.json(items[itemIndex]);
});

app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Элемент не найден' });
  }
  
  items.splice(itemIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});