// back in our API router
var router = require('express').Router();


router.use('/semester', require('./semester.route'));
router.use('/chapter', require('./chapter.route'));



module.exports = router;