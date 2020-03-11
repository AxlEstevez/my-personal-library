function showPass(){
    var object = document.getElementById("pass");
    var boton = document.getElementById("botonPass"); 
    if(object.type == "password")
    {
        object.type = "text";
        boton.value = "Ocultar Contrase&ntilde;a";
    }
    else
    {
        object.type = "password";
        boton.value = "Mostrar Contrase&ntilde;a";
    }
}

function cambia(contenedor) {
    var botonEditar = document.getElementById("boton-editar");
    var input = document.getElementById("nombre");
    var td = document.getElementById("nombre-td");


    if(input.style.display == "none"){
        input.style.display = "block";
        td.style.display = "none";
        botonEditar.textContent = "Guardar";
        botonEditar.onclick = guarda;
    }
}

function creaBoton() {
    var boton = document.createElement("td");

    boton.className = "link-editar";
    boton.id = "boton-guardar";

    boton.setAttribute("onclick","guarda();");

    return boton;
}

function guarda(){
    var botonEditar = document.getElementById("boton-editar");
    var input = document.getElementById("nombre");
    var td = document.getElementById("nombre-td");
    var nomInput = document.getElementById("nombre-in");

    console.log(nomInput.value);    
    if(input.style.display == "block" &&
        botonEditar.textContent == "Guardar"){
        
        td.innerHTML = nomInput.value;
        input.style.display = "none";
        botonEditar.textContent = "Editar";
        botonEditar.onclick = cambia;
        }
}