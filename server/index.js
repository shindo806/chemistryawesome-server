require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  getAllFile
} = require('./connectGD');
const {
  getChapterFiles
} = require('./models/chemgrade');
const getSemesterFiles = require('./models/semester');
const getChemGradeFiles = require('./models/chemgrade');
const app = express();
app.use(cors());
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

// End-Point for each chemgrade: 10 - 11 - 12
app.get('/:chemgrade', async (req, res) => {
  const data = await getChemGradeFiles(req.params.chemgrade);
  console.log(data)
  res.send({
    data: data.allFilesInChapter
  });
});

// End-Point for each 
app.get('/:chemgrade/:semester', async (req, res) => {
  const query = req.params;
  const data = await getSemesterFiles(query);

  res.send({
    data: data.allFilesInSemester
  })
})