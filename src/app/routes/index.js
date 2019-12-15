var express = require('express');
var router = express.Router();
var connection = require('../connection');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user_index');
});

router.get('/add', (req,res) =>{
  res.render('addElements');
});

router.get('/addBook', (req,res) => {
  res.render('addBook');
});
module.exports = router;
