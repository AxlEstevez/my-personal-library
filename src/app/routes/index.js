var express = require('express');
var router = express.Router();
var connection = require('./connection');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user_index');
});

router.get('/add', (req,res) =>{
  res.render('addElements');
});

router.get('/addBook', (req,res) => {
  connection.query("SELECT nombre,apellido FROM Autor", (err,result,fields) =>{
    if(err) throw err;
    res.render('addBook',{
      autors: result
    });
  });
});
module.exports = router;

/*router.get('/prueba', (req,res) =>{
  connection.query("SELECT nombre,apellido FROM Autor", (err,result,fields) =>{
    if(err) throw err;
    res.render('test',{
      values: result
    });
  });
});*/
