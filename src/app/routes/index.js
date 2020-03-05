const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const connection = require('./connection');
const rp = require('request-promise');
const cheerio = require('cheerio');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
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
  connection.query("SELECT clave,nombre,apellido FROM Autor", 
    (err,results,fields) =>{
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
    password: req.body.password
  };
  var aux = {
    usuario : req.body.userName,
    email : req.body.correo
  };
  // En está línea de código manda un error
  // Error sql : 1064
  // Es un error de sintaxis pero no encuentro el verdadero error
  connection.query("SELECT *FROM Usuarios",
    (err, results) =>{
      if(err){
        console.log(err);
        console.log("Si hay error estas aquí 1");
      }
      else{
        if(results.length > 0){
          var i = 0;
          var id = false;
          while(i < results.length){
            if(aux.usuario == results[i].usuario ||
                aux.email == results[i].correo){
                  console.log("Hay registros duplicados");
                  id = true;
                  break;
            }
            i++;
          }
          if(id){
            res.render("viewsError", {error: 1});
          }
          else{
            if(registro.password.length < 8 || registro.password.length > 16){
              res.render("viewsError", {error: 2});
              console.log("Si ya paso todo lo demas, pero no comples"+ 
                " con la integridad de la bd, estas aquí");
            }
            else{
              connection.query("INSERT INTO Usuarios SET ?", registro,
              (error,results) => {
                if(error){
                  console.log(error);
                  res.render("viewsError", {error: 3});
                  return;
                }
                else{
                  console.log("Bien ahora no hay problemas :D");
                  res.render("perfile", {mensaje : '1',usuario: registro.usuario});
                }
              });
            }
          }
        }  
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
    connection.query("SELECT usuario,password,correo FROM Usuarios WHERE usuario "
      + "= ? OR correo = ? AND password = ?",
    [usuario,usuario,pass], (error,results,fields) =>{
      if(results.length > 0){
        if(results[0].usuario == usuario || 
            results[0].correo == usuario && results[0].password == pass){
          req.session.loggedin = true;
          req.session.userName = usuario;
          res.render('perfile', {mensaje: '1',usuario: usuario});
        }
        else{
          res.send("<script type='text/javascript'>" +
             "alert('Usuario ó contraseña incorreta');" +
             "window.location.href='Sign_in';</script>");
        }
      }
      else{
        res.send("<script type='text/javascript'>" +
          " alert('Usuario no Encontrado ... verifica tus datos');" + 
          "window.location.href='Sign_in';</script>");
      }
      res.end();
    });
  }
  else{
    res.send("<script type='text/javascript'> " + 
      "alert('Ingresa usuario y contraseña');" +
      "window.location.href='Sign_in';</script>");
  }
});

router.get('/contacto', (req,res) =>{
  res.render("contacto");
})


// ruta para testear codigo tanto del lado del ciente
// como peticiones al servidor.
// Este se eliminara una vez entregada la versión final.
// ------------------------------------------------------
router.get('/user', (req,res) =>{
  var queryBook = connection.query('SELECT * FROM LibroAutor',
     (error , results) => {
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

router.get('testing', (req,res) =>{
  var isbn = req.body.ISBN;
  const url = 'https://books.google.es/';
  const search = '/search?tbm=bks&q=' + isbn;
  var elementos = (url,search) =>{
    return 0;
  };
});

router.get("/perfile", (req,res) =>{
  res.render("perfile");
})

router.get("/config", (req,res) =>{
  var query = connection.query("SELECT *FROM Usuarios", 
    (error,results) =>{
      if(error){
        console.log("Tienes un error de MySQL");
      }
      else{
        if(results.length > 0){
          res.render("config",{results});
        }
      }
    });
});

module.exports = router;

