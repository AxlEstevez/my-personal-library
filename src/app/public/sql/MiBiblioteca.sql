--- Proyecto Final
--- Base de Datos 19P
--- Axl Rodrigo Estevez Nieto
--- 2163070980
--- Universidad Autónoma Metropolitana
--- Unidad Cuajimalpa

-- Ejecutar ALTER TABLE Autor DROP pais y 
-- ALTER TABLE Editorial DROP pais desde la línea de 
-- comando de mysql.

DROP DATABASE IF EXISTS Biblioteca;

CREATE DATABASE Biblioteca;

USE Biblioteca;

CREATE TABLE Usuarios(
    Nombre VARCHAR(35) NOT NULL,
    apellido_p VARCHAR(35) NOT NULL,
    apellido_m VARCHAR(35) NOT NULL,
    sexo VARCHAR(25) NOT NULL,
    correo VARCHAR(100),
    usuario VARCHAR(50),
    password VARCHAR(16),
    PRIMARY KEY(correo,usuario),
    CHECK(sexo = 'masculino' OR sexo = 'femenino'),
    CHECK(LENGTH(password) >= 8 AND LENGTH(password) <= 16)
);

CREATE TABLE Libro(
    ISBN VARCHAR(16) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    edicion INTEGER NOT NULL,
    idioma VARCHAR(12) NOT NULL,
    paginas INTEGER NOT NULL,
    listaDeseo BOOLEAN NOT NULL,
    CHECK (paginas>=0)
);

CREATE TABLE Autor(
    clave INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    apellido VARCHAR(25) NOT NULL,
);

ALTER TABLE Autor AUTO_INCREMENT = 100;

CREATE TABLE Editorial(
    clave INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
);

ALTER TABLE Editorial AUTO_INCREMENT = 100;

CREATE TABLE Sagas(
    clave INTEGER AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(35) NOT NULL
);

ALTER TABLE Sagas AUTO_INCREMENT = 100;

CREATE TABLE Generos(
    nombre VARCHAR(30) PRIMARY KEY
);

CREATE TABLE Biblioteca_usuario(
    ISBN VARCHAR(16),
    correo VARCHAR(100),
    usuario VARCHAR(50),
    FOREIGN KEY(ISBN) REFERENCES Libro(ISBN)
    ON UPDATE CASCADE
    on DELETE CASCADE,
    FOREIGN KEY(correo,usuario) REFERENCES Usuarios(correo,usuario)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE Escribe(
    ISBN VARCHAR(16) NOT NULL,
    claveAutor INTEGER NOT NULL,
    FOREIGN KEY(ISBN) REFERENCES Libro(ISBN)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(claveAutor) REFERENCES Autor(clave)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE Publicaciones(
    ISBN VARCHAR(16) NOT NULL,
    claveEditorial INTEGER NOT NULL,
    FOREIGN KEY(ISBN) REFERENCES Libro(ISBN)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(claveEditorial) REFERENCES Editorial(clave)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE Pertenece(
    ISBN VARCHAR(16) NOT NULL,
    claveSaga INTEGER NOT NULL,
    FOREIGN KEY(ISBN) REFERENCES Libro(ISBN)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(claveSaga) REFERENCES Sagas(clave)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
);

CREATE TABLE GeneroDe(
    ISBN VARCHAR(16) NOT NULL,
    NombreGenero VARCHAR(30) NOT NULL,
    FOREIGN KEY(ISBN) REFERENCES Libro(ISBN)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY(NombreGenero) REFERENCES Generos(nombre)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
);

/*CREATE VIEW LibroAutor AS 
    SELECT Libro.titulo, Autor.nombre As AutorNombre,Autor.apellido AS AutorApellido FROM Libro,Autor,Escribe  
    WHERE Libro.ISBN = Escribe.ISBN AND Autor.clave = Escribe.claveAutor;*/

CREATE VIEW SagaLibros AS
    SELECT Libro.titulo, Sagas.nombre AS NombreSaga FROM Libro,Sagas,Pertenece 
    WHERE Libro.ISBN = Pertenece.ISBN and Pertenece.claveSaga = Sagas.clave;

CREATE VIEW GeneroLibro AS
    SELECT Libro.titulo, Generos.nombre AS Genero
    FROM Libro,Generos,GeneroDe 
    WHERE Libro.ISBN = GeneroDe.ISBN and Generos.nombre = GeneroDe.NombreGenero;

CREATE VIEW EditorialLibro AS
    SELECT Libro.titulo, Editorial.nombre AS editorial 
    FROM Libro,Editorial,Publicaciones 
    WHERE Libro.ISBN = Publicaciones.ISBN AND Editorial.clave = Publicaciones.claveEditorial;

CREATE VIEW ListaDeDeseos AS
    SELECT *FROM Libro WHERE listaDeseo = TRUE;

CREATE VIEW LibrosUser AS
    SELECT *FROM Libro WHERE listaDeseo = FALSE;

/*CREATE VIEW LibrosUsuario AS
    SELECT Libro.titulo, Autor.nombre As nombreAutor, Autor.apellido As apellidoAutor 
    FROM Libro,Autor,Usuarios,Biblioteca_usuario,Escribe
    WHERE Libro.ISBN = Escribe.ISBN AND Autor.clave = Escribe.claveAutor
    AND Libro.ISBN = Biblioteca_usuario.ISBN AND Usuarios.usuario = Biblioteca_usuario.usuario;*/

INSERT INTO Usuarios VALUES
    ('Axl Rodrigo','Estevez','Nieto','masculino','axlestevez@hotmail.com','AxlEstevez','chambitas'),
    ('Juana','Ambrosio','Lucas','femenino','Juanita@hotmail.com','Juanis','chambitas');

INSERT INTO Libro VALUES
    ('9786076227725','Desarrollo y Programación en entornos web',1,'Español',284,FALSE),
    ('9788498384406','Harry Potter y la cámara secreta',15,'Español',296,FALSE),
    ('9788498384383','Harry Potter y la piedra filosofal',15,'Español',256,FALSE),
    ('9786075294551','Entrevista con el vampiro',1,'Español',384,FALSE),
    ('9786071609175','El camino de los muertos',1,'Español',272,FALSE),
    ('9786076226612','Python Fácil',1,'Español',284,FALSE),
    ('9786075383613','Big Data con Python',1,'Español',284,TRUE);

INSERT INTO Autor(nombre,apellido,pais) VALUES
    ('Angel','Gutiérrez','México'),
    ('José Luis','Lopez','México'),
    ('J.K','Rowling','Inglaterra'),
    ('Anne','Rice','Estado Unidos'),
    ('Kevin','Brooks','Inglaterra'),
    ('Arnaldo','Pérez','España'),
    ('Rafael','Caballero','España'),
    ('Enrique','Martín','España'),
    ('Adrián','Riesco','España');

INSERT INTO Editorial(nombre,pais) VALUES
    ('Alfaomega','México'),
    ('Fondo de Cultura Economica','México'),
    ('Ediciones B','España'),
    ('Salamandra S.A','España');

INSERT INTO Sagas(nombre) VALUES('Harry Potter'), ('Cronicas Vampiricas');

INSERT INTO Generos(nombre) VALUES
    ('Ciencia Ficcion'),
    ('Thriller'),
    ('Fantasia'),
    ('Terror'),
    ('Escolar');

INSERT INTO Escribe VALUES
    ('9786076227725', 100),
    ('9786076227725', 101),
    ('9788498384406', 102),
    ('9788498384383', 102),
    ('9786075294551', 103),
    ('9786071609175', 104),
    ('9786076226612', 105),
    ('9786075383613', 106),
    ('9786075383613', 107),
    ('9786075383613', 108);

INSERT INTO Publicaciones VALUES
    ('9786076227725',100),
    ('9788498384406',103),
    ('9788498384383',103),
    ('9786075294551',102),
    ('9786071609175',101),
    ('9786076226612',100),
    ('9786075383613',100);

INSERT INTO Pertenece VALUES
    ('9788498384406',100),
    ('9788498384383',100),
    ('9786075294551',101);

INSERT INTO GeneroDe VALUES
    ('9786076227725','Escolar'),
    ('9788498384406','Fantasia'),
    ('9788498384383','Fantasia'),
    ('9786075294551','Ciencia Ficcion'),
    ('9786071609175','Thriller'),
    ('9786076226612','Escolar'),
    ('9786075383613','Escolar');

INSERT INTO Biblioteca_usuario VALUES
    ('9788498384383','axlestevez@hotmail.com','AxlEstevez'),
    ('9788498384406','axlestevez@hotmail.com','AxlEstevez'),
    ('9786076227725','Juanita@hotmail.com','Juanis');


DROP TABLE IF EXISTS `LibroAutor`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `LibroAutor`  AS
  select `Libro`.`ISBN` AS `isbn`,`Libro`.`titulo` AS `titulo`,`Autor`.`nombre` AS
   `nombre`,`Autor`.`apellido` AS `apellido` from
    ((`Libro` join `Autor`) join `Escribe`) where
     `Libro`.`ISBN` = `Escribe`.`ISBN` and `Autor`.`clave` = `Escribe`.`claveAutor` ;

DROP TABLE IF EXISTS `Bibliotecas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `Bibliotecas`  AS  
select `LibroAutor`.`isbn` AS `isbn`,`LibroAutor`.`titulo` AS `titulo`,`LibroAutor`.`nombre` AS 
`nombre`,`LibroAutor`.`apellido` AS `apellido`,`Usuarios`.`usuario` AS 
`usuario`,`Usuarios`.`correo` AS `correo`
 from ((`LibroAutor` join `Usuarios`) join `Biblioteca_usuario`)
  where `LibroAutor`.`isbn` = `Biblioteca_usuario`.`ISBN` 
  and `Usuarios`.`usuario` = `Biblioteca_usuario`.`usuario` 
  and `Usuarios`.`correo` = `Biblioteca_usuario`.`correo` ;