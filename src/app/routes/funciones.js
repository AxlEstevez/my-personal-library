const connection = require('./connection');

var validacion = function verificaISBN(isbn){
    var query = connection.query('SELECT *FROM Libro '+
    'WHERE ISBN = ?',[isbn], (error,result) =>{
        if(error){
            console.log(error)
            return false;
        }else{
            if(result.length > 0){
                return false;
            }
            else{
                return true;
            }
        }
    });
}

module.exports = validacion;