var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user_index');
});

router.get('/add', (req,res) =>{
  res.render('addElements');
})
module.exports = router;
