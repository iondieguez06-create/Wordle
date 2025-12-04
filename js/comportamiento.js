//declaro las variables que necesito tener fuera
let palabraSecreta = "";
let palabraCargada = false;

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

document.addEventListener("DOMContentLoaded", async () => {
  await iniciarJuego();

  //aquí guardo las 5 filas de inputs para poder acceder por número de fila
  const filasInputs = [
    null,
    document.querySelectorAll(".fila1"),
    document.querySelectorAll(".fila2"),
    document.querySelectorAll(".fila3"),
    document.querySelectorAll(".fila4"),
    document.querySelectorAll(".fila5"),
    document.querySelectorAll(".fila6"),
  ];

  let filaActual = 1;

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
        repetidas[letraUsuario]--;
      }
    }

    //segunda pasada: marcar estan y ausentes 
    for (let i = 0; i < letrasSecretas.length; i++) {
      const letraUsuario = letrasUsuario[i];
      const letraSecreta = letrasSecretas[i];

      if (letraUsuario === letraSecreta) continue;

      //si la letra aún sobra en el conteo, está en la palabra pero mal colocada
      if (repetidas[letraUsuario] > 0) {
        inputsFila[i].classList.add("esta");
        repetidas[letraUsuario]--;
      } else {
        //si no, no existe en la palabra
        inputsFila[i].classList.add("ausente");
      }
    }
  }

  //configuro el comportamiento de escritura y navegación en todas las filas
  for (let fila = 1; fila <= 6; fila++) {
    const inputs = filasInputs[fila];

    for (let col = 0; col < inputs.length; col++) {
      //cuando escribes una letra: limpia, pone mayúscula y avanza al siguiente input
      inputs[col].addEventListener("input", function () {
        this.value = this.value
          .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "")
          .toUpperCase();

        if (this.value !== "" && col < inputs.length - 1) {
          inputs[col + 1].focus();
        }
      });

      //maneja retroceso y envío (Enter) dentro de cada fila
      inputs[col].addEventListener("keydown", function (e) {
        if (!palabraCargada) return;

        //retroceso para volver a la casilla anterior vacía
        if (e.key === "Backspace" && this.value === "" && col > 0) {
          inputs[col - 1].focus();
        }

        //si se pulsa Enter y la fila está llena, se comprueba la palabra
        if (e.key === "Enter" && fila === filaActual && filaCompleta(inputs)) {
          const palabra = unirPalabra(inputs);
          comprobarPalabra(palabra, inputs);

          if (filaActual === 6 && palabra !== palabraSecreta) {
            alert(`Juego terminado. La palabra era: ${palabraSecreta}`);
            return;
          }else if (palabra === palabraSecreta){
            alert(`HAS ADIVINADO LA PALABRA!!!`)
            return;
          }

          //si hay más intentos, bajo a la siguiente fila
          if (filaActual < 6) {
            filaActual++;
            filasInputs[filaActual][0].focus();
          }
        }
      });
    }
  }
});
