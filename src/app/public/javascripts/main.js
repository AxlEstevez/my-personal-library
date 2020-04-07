'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

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
    var despliegue = document.getElementById("autor2");
    
    if(seleccion.value == "otro"){
        seleccion.style.display = "none";
        despliegue.style.display = "block";
    }
}

const domContainer = document.querySelector('#contendedor');
ReactDOM.render(e(LikeButton), domContainer);