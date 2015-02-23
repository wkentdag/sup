var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json(200, {message:"welcome to sup API"});
});

module.exports = router;
