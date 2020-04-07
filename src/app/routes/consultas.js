// 'importaciones' de módulos requeridos
const connection = require('./connection');
// --------------------------------------------------------
// Métodos para uso de consultas en la base de datos
// --------------------------------------------------------

// --------------------------------------------------------
// Método: validaUsuario
// Parámetros: String usuario, String correo
// retorna: booleano
// Objetivo: Verifica si en la base de datos existe algún
// registro con los datos que se le estan enviando como
// parametro. De encontrar algún registro se con los datos 
// antes mencionado, el método retornara true, de lo
// ontrario, retornara false.
// --------------------------------------------------------
module.exports.validaRegistro = (usuario,correo) => {
    var busca = -1;
    connection.query("SELECT *FROM Usuarios "+
    "WHERE usuario = ? OR correo = ?",[usuario,correo],
    (error,results) =>{
        if(error){
          busca = 0;
        }else{
            if(results.length > 0){
                console.log(results);
                busca = 1;
            }
            else{
                busca = 0;
            }
        }
    });
    console.log(busca);
    return busca;
};// Fin del método
// --------------------------------------------------------

// --------------------------------------------------------
// Método: insertaUsuario
// Parámetros: Array registro
// retorna: booleano
// Objetivo: Inserta un registro en la base de datos.
// Retorna false si ocurriera algun error y true si la
// consulta fue realizada con exito.
// --------------------------------------------------------
module.exports.insertaUsuario = (registro) =>{

    var status = connection.query("INSERT INTO Usuarios SET ?",
    [registro],(error,results) =>{
        if(error){
            return false;
        }
        else{
            return true;
        }
    });

    console.log(status);
    return status;
};// Fin del método
// --------------------------------------------------------

module.exports.validaUsuario = (identidad,password, callback) =>{

    connection.query("SELECT *FROM Usuarios WHERE"+
    " (usuario = BINARY ? OR correo = BINARY ?) AND password = BINARY ?",
    [identidad,identidad,password], (error,results) =>{

        if(error){
            callback(error,null);
        }
        else{
            if(results.length > 0){
                callback(null,1)
            }
            else{
                callback(null,0)
            }
        }
    });
}

module.exports.insertaLibro = (Libro) =>{
    var ok;
    var sql = "INSERT INTO Libro SET ?";
    connection.query(sql,[Libro],(error,result)=>{
        if(error){
            ok = false;
        }
        else{
            ok = true;
        }
    });
    console.log(ok);
    return ok;
}

module.exports.separaAutor = (cadena) =>{
    return cadena.split("#");
}

// --------------------------------------------------------
// módulo: verificaLibro
// Parámetros: string: isbn, fuction: callback
// retorna: -
// Objetivo: verifica si existe un libro dado por su ISBN.
// -------------------------------------------------------- 
module.exports.verificaLibro = (isbn,callback) => {
    // Consulta a la base de datos a realizar.
    const sql = "SELECT *FROM Libro WHERE ISBN = ?";
    // se crea la conexión y se hace la consulta
    connection.query(sql,[isbn],(error,results) =>{
        // Si existe algun error, se le pasa como parámetro
        // el error al callback.
        if(error){
            callback(error,null);
        }
        // Si existen registros en la base de datos
        // se le pasa uno como valor al callback
        if(results.length > 0){
            callback(null,1);
        }
        // si no se pasa 0.
        else{
            callback(null,0);
        }
    }); // Fin de el query
}
// --------------------------------------------------------

module.exports.buscaAutor = (dataAutor,callback) =>{
    var sql = "SELECT *FROM Autor WHERE (nombre = ? AND "+
    "apellido = ?)";

    connection.query(sql,[dataAutor[0],dataAutor[1]],
        (error,results) =>{
            if(error){
                callback(error,null);
            }
            if(results.length > 0){
                callback(null,1);
            }
            else{
                callback(null,0);
            }
        });
}

module.exports.getClaveAutor = (autorData,callback) => {
    var sql = "SELECT clave FROM Autor where (nombre = ?"+
    " AND apellido = ? )";
    connection.query(sql,[autorData[0],autorData[1]],
    (error,results) =>{

        if(error){
            callback(error,null);
        }
        if(results.length > 0){
            callback(null,results);
        }
        else{
            callback(null,0);
        }
    });
}

module.exports.insetaEnEscribe = (clave,isbn, fn) =>{
    var sql = "INSERT INTO Escribe SET ?";

    connection.query(sql,[clave,isbn], (error,results) =>{
        if(error){
            fn(0);
        }
        else{
            fn(1);
        }
    });
}

module.exports.insertBibliotecaUsuario = (usuario,isbn,fn) =>{
    var sql = "INSERT INTO Biblioteca_usuario SET ?";

    connection.query(sql,[usuario.usuario,usuario.correo],
        (error,results) =>{
            if(error){
                fn(0);
            }
            else{
                fn(1);
            }
        });
}
// Cuando un libro nuevo se ingresa es necesario ingresar
// datos a las tablas de libro, autor y Biblioteca1-usuario
// isbn, titulo,edicion,idioma,paginas,listaDeseo -- Libro
// clave,nombre,apellido,pais -- Autor
// isbn, correo, usuario -- Biblioteca_usuario