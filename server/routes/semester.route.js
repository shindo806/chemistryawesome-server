const express = require('express');
const router = express.Router();
const {
  getAllSemesterFiles,
  getFilesById
} = require('../models/semester');

router.get('/:chemgrade', async (req, res) => {
  const query = req.params;
  const data = await getAllSemesterFiles(query)

  res.send({
    data: data.allFilesInSemester
  })
})

router.get('/:chemgrade/:id', async (req, res) => {
  const query = req.params;
  const data = await getFilesById(query)

  res.send({
    data
  })
})

module.exports = router;