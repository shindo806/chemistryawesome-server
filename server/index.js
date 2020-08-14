const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});

app.get('/ping', (req, res) => {
  res.send('Ping is good');
});
