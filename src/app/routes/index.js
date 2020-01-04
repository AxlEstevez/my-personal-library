var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
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
  connection.query("SELECT nombre,apellido FROM Autor", (err,results,fields) =>{
    if(err) throw err;
    res.render('addBook',{
      autors: results
    });
  });
});

router.get('/Sign_up', (req,res) =>{
  res.render('Sign_up');
});

router.post('/Sign_up',(req,res,next) =>{
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
      res.send("Error , verifica tus datos <a href='Sign_up' class='btn btn-danger'>Continuar</a>" ,);
      return;
    }
    else{
      res.render("user_index", {mensaje : '1'});
    }
  });
});

router.get('/Sign_in', (req,res) =>{
  res.render('sign_in');
});

router.post('/Sign_in', (req,res) =>{
  var usuario = req.body.identidad;
  var pass = req.body.password;
  if (usuario && pass) {
    connection.query("SELECT usuario,password,correo FROM Usuarios WHERE usuario = ? OR correo = ? AND password = ?",
    [usuario,usuario,pass], (error,results,fields) =>{
      if(results.length > 0){
        if(results[0].usuario == usuario || results[0].correo == usuario && results[0].password == pass){
          console.log(results);
          req.session.loggedin = true;
          req.session.userName = usuario;
          res.render('user_index', {mensaje: '1'});
        }
        else{
          res.send("<script type='text/javascript'> alert('Usuario ó contraseña incorreta'); window.location.href='Sign_in';</script>");
        }
      }
      else{
        res.send("<script type='text/javascript'> alert('Usuario no Encontrado ... verifica tus datos'); window.location.href='Sign_in';</script>");
      }
      res.end();
    });
  }
  else{
    res.send("<script type='text/javascript'> alert('Ingresa usuario y contraseña'); window.location.href='Sign_in';</script>");
  }
});


// ruta para testear codigo tanto del lado del ciente
// como peticiones al servidor.
// Este se eliminara una vez entregada la versión final.
// ------------------------------------------------------
router.get('/user', (req,res) =>{
  res.render('test');
});


module.exports = router;

