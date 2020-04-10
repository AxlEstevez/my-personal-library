USE Biblioteca;
/*
INSERT INTO Libro VALUES
("9780451119674","El resplandor",1,"Español",688,0),
("9786074804362","Finale: EL esperado final de la saga hush, hush",1,"Español",480,0);
*/
/*
INSERT INTO Autor(nombre,apellido) VALUES
("Stephen","King"),
("Becca","Fitzpatrick");
*/
UPDATE Escribe 
SET claveAutor = 110 
WHERE ISBN = "9780451119674";
UPDATE Escribe SET claveAutor = 111 
WHERE ISBN = "9786074804362";