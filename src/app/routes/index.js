const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const connection = require('./connection');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Ruta para la página que permite agregar nuevos registros
// a la base de datos.
router.get('/add', (req,res) =>{
  res.render('addElements');
});

// Se ocupa para obtener los registros de manera dinámica
// desde el servidor al cliente.
// --------------------------------------------------------
// Se hace una conexión a la base de datos para recuperar
// tanto nombre como apellido y clave de los autores que se
// tienen registro hasta el momento. 
// Se manda los resultados lanzados por la base de datos en
// una variable llamada autors, para que el cliente pueda 
// ocupar esos datos.
// --------------------------------------------------------
router.get('/addBook', (req,res) => {
  connection.query("SELECT clave,nombre,apellido FROM Autor", (err,results,fields) =>{
    if(err) throw err;
    res.render('addBook',{
      autors: results
    });
  });
});
// fin de la función
// --------------------------------------------------------
router.get('/Sign_up', (req,res) =>{
  res.render('Sign_up');
});


// Esta ruta es la que valida lo datos del usuario 
// al momento de iniciar sesión.
// --------------------------------------------------------
// Obtiene datos del navegador por medio del metodo post
// Hace una consulta select a la base de datos y compara
// si los datos registrados corresponden a los datos
// ingresados por el usuario, así tambien compara si existe
// un registro previo del usuario.
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
// Fin del metodo
// --------------------------------------------------------
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
  var queryBook = connection.query('SELECT * FROM LibroAutor', (error , results) => {
      if(error){
        console.log(error);
      }
      else{
        if(results.length > 0){
          res.render('test', {results});
        }
        else{
          console.log("Error , datos no encontrados");
        }
      }
    });
});


module.exports = router;

