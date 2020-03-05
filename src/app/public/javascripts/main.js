function showPass(){
    var object = document.getElementById("pass");
    var boton = document.getElementById("botonPass"); 
    if(object.type == "password")
    {
        object.type = "text";
        boton.innerHTML = "Ocultar Contrase&ntilde;a";
    }
    else
    {
        object.type = "password";
        boton.innerHTML = "Mostrar Contrase&ntilde;a";
    }
}