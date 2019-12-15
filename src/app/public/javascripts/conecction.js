const mysql = require('mysql');

const connection = mysql.newConnection({
	host: '127.0.0.0',
	user: 'root',
	pass: '',
	DB: 'libreria'
});