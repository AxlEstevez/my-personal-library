const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Biblioteca',
});

connection.connect((error) =>{
	if(error){
		console.log("no he ha podido establecer conexion con la base de datos");
	}
	else{
		console.log("Conexion establecida con exito¡");
	}
});

module.exports = connection;