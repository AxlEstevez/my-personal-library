function showPass(){
    var object = document.getElementById("pass");
    var boton = document.getElementById("botonPass"); 
    if(object.type == "password")
    {
        object.type = "text";
        boton.value = "Ocultar Contraseña";
    }
    else
    {
        object.type = "password";
        boton.value = "Mostrar Contraseña";
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

function verificaSelect(){
    var seleccion = document.getElementById("Autor");
    var despliegue = document.getElementById("autor");
    
    if(seleccion.value == "otro"){
        despliegue.style.display = "block";
    }
}

function agregaAutor() {
  var nombre = document.getElementById("nombreAutor");
  var apellido = document.getElementById("apellidosAutor");
  var destino = document.getElementById("Autor");
  var origen = document.getElementById("autor");
  var valor = String(nombre.value) + "#" + String(apellido.value);
  var nodoText = String(nombre.value) + " " + String(apellido.value);
  var opt = document.createElement("option");
  var optionOtro = document.getElementById("otro");

  opt.value = valor;
  opt.textContent = nodoText;

  destino.insertBefore(opt,optionOtro);

  if(origen.style.display == "block"){
    origen.style.display = "none";
    nombre.value = "";
    apellido.value = "";
  }
}

function cerrarVentana(){
  var ventana = document.getElementById("autor");

  ventana.style.display = "none";
}