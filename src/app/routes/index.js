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

router.get('/Sign_up', (req,res) =>{
  res.render('Sign_up');
});

router.post('/Sign_up',(req,res) =>{
  var registro = {
    nombre:  req.body.nombre,
    apellido_p: req.body.apellido_p,
    apellido_m: req.body.apellido_m,
    sexo: req.body.sexo,
    correo: req.body.correo,
    usuario: req.body.userName,
    password: req.body.pass
  };
  connection.query("INSERT INTO Usuarios SET ?", registro,
  (error,results) => {
    if(error){
      console.log(error);
      res.redirect("Sign_up");
    }
  });
  res.render("user_index");
});

module.exports = router;

