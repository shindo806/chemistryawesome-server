require('dotenv').config();
const express = require('express');
const {
  getAllFile
} = require('./connectGD');
const {
  getChapterFiles
} = require('./models/chapter');
const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server is running on port 4000');
});
app.get('/', async (req, res) => {
  const data = await getAllFile();
  res.send(data);
});

app.get('/ping', (req, res) => {
  res.send('Ping is good');
});

// End-Point for Chem10
app.get('/chem10', async (req, res) => {
  const data = await getChapterFiles('Chem10')
  res.send(data);
});