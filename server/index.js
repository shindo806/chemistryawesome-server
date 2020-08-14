const express = require('express');
const {
  getAllFile,
  listFiles
} = require('./connectGD');
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
app.get('/', async (req, res) => {
  const data = await getAllFile();
  console.log('data in server', data)
  res.send(data);
});
app.get('/ping', (req, res) => {
  res.send('Ping is good');
});