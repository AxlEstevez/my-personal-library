var express = require('express');
var router = express.Router();
var connection = require('./connection');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
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

router.get('/Sing_up', (req,res) =>{
  res.render('Sing_up');
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
