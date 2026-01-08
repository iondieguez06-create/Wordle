//declaro las variables que necesito tener fuera
let palabraSecreta = "";
let palabraCargada = false;

//estas variables controlan en qué fila y columna estoy escribiendo
let filaActual = 1; 
let colActual = 0; 
let filasInputs = []; 

//pido la palabra a la api
function palabraApi() {
  return fetch("https://random-word-api.herokuapp.com/word?length=5&lang=es")
    .then((r) => r.json())
    .then((d) => d[0]);
}

//fucnion para obtener la apalabra mas adelante
async function obtenerPalabra() {
  return palabraApi();
}

//esta fucnion es importante para iniciar el juego y cargar la palabra
async function iniciarJuego() {
  const palabra = await obtenerPalabra();
  palabraSecreta = palabra.toUpperCase();
  palabraCargada = true;
  console.log("Palabra secreta:", palabraSecreta);
}

//esta función mueve el cursor a la columna que le digas
function moverCursor(nuevaCol) {
  const fila = filasInputs[filaActual];

  if (nuevaCol < 0) nuevaCol = 0;

  if (nuevaCol >= fila.length) nuevaCol = fila.length - 1;

  colActual = nuevaCol;
  fila[colActual].focus();
}

//esta avanza el cursor a la derecha
function avanzarCursor() {
  moverCursor(colActual + 1);
}

//esta retrocede el cursor a la izquierda
function retrocederCursor() {
  moverCursor(colActual - 1);
}
document.addEventListener("DOMContentLoaded", async () => {
  await iniciarJuego();

  //aqui recojo todos los botones de letras
  const botones = document.querySelectorAll(".casillaLetra");

  //aquí guardo las 5 filas de inputs para poder acceder por número de fila
  filasInputs = [
    null,
    document.querySelectorAll(".fila1"),
    document.querySelectorAll(".fila2"),
    document.querySelectorAll(".fila3"),
    document.querySelectorAll(".fila4"),
    document.querySelectorAll(".fila5"),
    document.querySelectorAll(".fila6"),
  ];

  //enfoco la primera casilla
  filasInputs[filaActual][colActual].focus();

  //comprueba si una fila ya tiene sus 5 letras puestas
  function filaCompleta(inputs) {
    return Array.from(inputs).every((input) => input.value !== "");
  }

  //une los 5 inputs en una palabra completa
  function unirPalabra(inputs) {
    return Array.from(inputs)
      .map((input) => input.value)
      .join("");
  }

  //compara palabra del usuario con la secreta y asigna colores
  function comprobarPalabra(palabra, inputsFila) {
    const letrasSecretas = palabraSecreta.split("");
    const letrasUsuario = palabra.toUpperCase().split("");

    //cuento cuántas veces aparece cada letra en la palabra secreta
    const repetidas = {};
    for (const letra of letrasSecretas) {
      repetidas[letra] = (repetidas[letra] || 0) + 1;
    }

    //primera pasada: marcar aciertos exactos (verdes)
    for (let i = 0; i < letrasSecretas.length; i++) {
      const letraUsuario = letrasUsuario[i];
      const letraSecreta = letrasSecretas[i];

      inputsFila[i].classList.remove("correcta", "esta", "ausente");

      if (letraUsuario === letraSecreta) {
        inputsFila[i].classList.add("correcta");
        letraUsuario.toUpperCase;
        const letraBoton= document.getElementById(letraUsuario);
        letraBoton.classList.add("correcta");
        repetidas[letraUsuario]--;
      }
    }

    //segunda pasada: marco estan y ausentes
    for (let i = 0; i < letrasSecretas.length; i++) {
      const letraUsuario = letrasUsuario[i];

      //si ya es correcta no se toca
      if (inputsFila[i].classList.contains("correcta")) continue;

      //si la letra aún sobra en el conteo, está en la palabra pero mal colocada
      if (repetidas[letraUsuario] > 0) {
        inputsFila[i].classList.add("esta");
        letraUsuario.toUpperCase;
        const letraBoton= document.getElementById(letraUsuario);
        letraBoton.classList.add("esta");
        repetidas[letraUsuario]--;
      } else {
        //si no, no existe en la palabra
        inputsFila[i].classList.add("ausente");
        letraUsuario.toUpperCase;
        const letraBoton= document.getElementById(letraUsuario);
        letraBoton.classList.add("ausente");
      }
    }
  }
  //aquí configuro el teclado virtual
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const letra = boton.textContent.toUpperCase();

      const fila = filasInputs[filaActual];
      const inputActual = fila[colActual];

      //escribe la letra en la casilla actual
      inputActual.value = letra;

      //uso la función nueva para avanzar el cursor correctamente
      avanzarCursor();
    });
  });

  //configuro el comportamiento de escritura y navegación en todas las filas
  for (let fila = 1; fila <= 6; fila++) {
    const inputs = filasInputs[fila];

    for (let col = 0; col < inputs.length; col++) {
      //cuando escribes una letra: limpia, pone mayúscula y avanza al siguiente input
      inputs[col].addEventListener("input", function () {
        this.value = this.value
          .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "")
          .toUpperCase();

        //sincronizo el cursor cuando escribes con el teclado físico
        colActual = col;
        avanzarCursor();
      });

      //maneja retroceso y envío dentro de cada fila
      inputs[col].addEventListener("keydown", function (e) {
        if (!palabraCargada) return;

        //retroceso para volver a la casilla anterior vacía
        if (e.key === "Backspace") {
          const filaInputs = filasInputs[filaActual];

          if (col > 0) {
            if (this.value !== ""){
              this.value = "";
            }else if(this.value==""){
              const indiceAnterior = col - 1;

            filaInputs[indiceAnterior].value = "";

            colActual = indiceAnterior;
            moverCursor(colActual);
          }
            
          } else {
            this.value = "";
            colActual = 0;
            moverCursor(colActual);
          }

          return;
        }

        //si se pulsa Enter y la fila está llena, se comprueba la palabra
        if (e.key === "Enter" && fila === filaActual && filaCompleta(inputs)) {
          const palabra = unirPalabra(inputs);
          comprobarPalabra(palabra, inputs);

          //si el jugador pierde en la última fila
          if (filaActual === 6 && palabra !== palabraSecreta) {
            alert(`Juego terminado La palabra era: ${palabraSecreta}`);
            return;
          }

          //si el jugador acierta
          if (palabra === palabraSecreta) {
            alert("HAS ADIVINADO LA PALABRA!!!");
            return;
          }

          //si hay más intentos, bajo a la siguiente fila
          if (filaActual < 6) {
            filaActual++;
            colActual = 0;
            filasInputs[filaActual][0].focus();
          }
        }
      });

      //cuando haces click en cualquier input, sincronizo el cursor
      inputs[col].addEventListener("focus", function () {
        colActual = col; 
      });
    }
  }
});
