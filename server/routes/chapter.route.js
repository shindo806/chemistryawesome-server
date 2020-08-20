const express = require('express');
const router = express.Router();

const getChemGradeFiles = require('../models/chemgrade');

//   /chapter/chem10
router.get('/:chemgrade', async (req, res) => {
  const data = await getChemGradeFiles(req.params.chemgrade);

  res.send({
    data: data.allFilesInChapter
  });
})

module.exports = router;