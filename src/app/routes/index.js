const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const connection = require('./connection');
const consulta = require('./consultas');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
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
  if(req.session.loggedin){
    connection.query("SELECT nombre, apellido FROM Bibliotecas where usuario = ?", 
    [req.session.username],(err,results,fields) =>{
    if(err) throw err;
    res.render('addBook',{
      autors: results,
      usuario: req.session.username
    });
  });
  }
  else{
    res.render("viewsError", {error:7});
  }
});
// fin de la función
// --------------------------------------------------------

router.post('/addBook', (req,res) => {
  // El usuario debe de estár loggeado para acceder a 
  // esta ruta.
  if(req.session.loggedin){
    var libro = {
      ISBN: req.body.isbn,
      titulo : req.body.titulo,
      edicion: req.body.edicion,
      idioma: req.body.idioma,
      paginas:req.body.paginas,
      listaDeseo: 0
    };
    var autor = req.body.autor;
    var dataAutor = consulta.separaAutor(autor);
    // se verifica la existencia del libro en la tabla "maestra"
    consulta.verificaLibro(libro.ISBN,(error,valor)=>{
      if(error){
        res.render("viewsError", {error:3});    
      }
      if(valor > 0){
        consulta.buscaAutor(dataAutor,(error,valor)=>{
          if(error){
            res.render("viewsError", {error:3});
          }
          if(valor > 0){
            consulta.getClaveAutor(dataAutor,(error,clave)=>{
              if(error){
                res.render("viewsError", {error:3});
              }
              if(clave != 0){
                
              }
            });
          }
        });
      }// Fin if de valor libro
      else{
        consulta.insertaLibro(libro);
      }
    });
  }
  // Si el usuario no esta loggeado, el sistema
  // lo renderizara a otra interfaz para notificar el error.
  else{
    res.render("viewsError", {error:7});
  }
}); // fin de modulo
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
  var auxiliar = consulta.validaRegistro(registro.usuario,registro.correo);
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
            connection.query("INSERT INTO Usuarios SET ?", [registro],
              (error,results) => {
                if(error){
                  console.log(error);
                  console.log("El error que jode esta aquí");
                  res.render("viewsError", {error: 3});
                  return;
                }
                else{
                  console.log("Bien ahora no hay problemas :D");
                  req.session.loggedin = true;
                  req.session.username = registro.usuario;
                 res.redirect('autentication');
                }
              });
            }
          
        }  
      }
    });
});// Fin del metodo
// --------------------------------------------------------
// Sign in - ruta
router.get('/Sign_in', (req,res) =>{
  res.render('sign_in');
});
// fin sign in - ruta
// --------------------------------------------------------

// Sign in - post
// --------------------------------------------------------
router.post('/Sign_in', (req,res) =>{
  var usuario = req.body.identidad;
  var pass = req.body.password;
  consulta.validaUsuario(usuario,pass,(error,valor)=>{
    // Error viene de la base de datos
    if(error){
      res.render("viewsError", {error:3});
    }
    if(valor < 1){
      res.render("viewsError", {error:4});
    }
    else{
      req.session.loggedin = true;
      req.session.userName = usuario;
      req.session.loggedin = true;
      req.session.username = usuario;
      res.redirect("/autentication");
    }
  });
});
// fin de sign in
// --------------------------------------------------------

router.get("/autentication", (req,res)=>{
  if(req.session.loggedin){
    var queryBook = connection.query('SELECT isbn,titulo,nombre,'+
    'apellido from Bibliotecas where usuario = ?',
    [req.session.username] ,(error , results) => {
     if(error){
       console.log(error);
     }
     else{
       if(results.length > 0){
         console.log(results);
         res.render('perfile', {
           mensaje : 1 ,
           results,
          usuario: req.session.username
        });
       }
       else{
         console.log("Error , datos no encontrados");
         res.render('perfile',{
          mensaje : 1 ,
          results,
          usuario: req.session.username
         });
       }
     }
   });
  }
  else{
    res.render("viewsError", {error:7});
  }
});

router.get("/salir", (req,res) =>{
  req.session.destroy();
  res.render("logout");
});

router.get('/contacto', (req,res) =>{
  res.render("contacto");
});

router.get('/acerca', (req,res) => {
  res.render("acerca");
})

router.get('/coleccion', (req,res) =>{
  if(req.session.loggedin){
    var queryBook = connection.query('SELECT isbn,titulo,nombre,apellido where usuario = ?',
    session.loggedin.username ,(error , results) => {
     if(error){
       console.log(error);
     }
     else{
       if(results.length > 0){
         res.render('perfil', {mensaje : 1 ,results});
       }
       else{
         console.log("Error , datos no encontrados");
       }
     }
   });
  }
  else{
    res.render("viewsError", {error:7});
  }
});


// ruta para testear codigo tanto del lado del ciente
// como peticiones al servidor.
// Este se eliminara una vez entregada la versión final.
// ------------------------------------------------------
router.get('/coleccion', (req,res) =>{
  var queryBook = connection.query('SELECT isbn,titulo,nombre,apellido where usuario = ?',
     session.loggedin.usuario ,(error , results) => {
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

router.get("/perfile", (req,res) =>{
  if(req.session.loggedin){
    res.render("perfile", {
      usuario:req.session.userName,
      mensaje: '2'
    });
  }
  else{
    res.render("viewsError", {error:7});
  }
  
});

router.get("/config", (req,res) =>{
  if(req.session.loggedin){
    var query = connection.query("SELECT *FROM Usuarios" 
      , (error,results) =>{
      if(error){
        console.log(error);
       res.render("viewsError", {error:3});
      }
      else{
        if(results.length > 0){
          i = 0;
          while(i < results.length){
            console.log(req.session.username);
            if(req.session.username == results[i].usuario || 
                req.session.username == results[i].correo ){
                  res.render("config",{usuario: results[i]});
                }
            i++;
          }
        }
        else{
          res.render("viewsError", {error:3});
        }
      }
    });
  }
  else{
    res.render("viewsError", {error:7});
  }
});

module.exports = router;

