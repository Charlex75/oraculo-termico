// Nodos del DOM que vamos a leer o modificar
const selectorDificultad = document.querySelector("#dificultad");
const botonNuevaPartida = document.querySelector("#nueva-partida");
const formulario = document.querySelector("#formulario");
const inputIntento = document.querySelector("#intento");
const botonConsultar = document.querySelector("#consultar");
const respuesta = document.querySelector("#respuesta");
const marcador = document.querySelector("#marcador");
const historial = document.querySelector("#historial");

// Cada dificultad cambia el rango y los intentos disponibles
const dificultades = {
  facil: { maximo: 50, intentos: 8 },
  normal: { maximo: 100, intentos: 10 },
  dificil: { maximo: 500, intentos: 12 },
};

// Estado de la partida: se rellena en nuevaPartida()
let maximo;
let intentosMaximos;
let secreto;
let intentos;

function nuevaPartida() {
  const config = dificultades[selectorDificultad.value];
  maximo = config.maximo;
  intentosMaximos = config.intentos;
  secreto = generarSecreto(maximo);
  intentos = 0;

  historial.replaceChildren();
  inputIntento.disabled = false;
  botonConsultar.disabled = false;
  inputIntento.value = "";
  inputIntento.placeholder = `Del 1 al ${maximo}`;
  mostrarRespuesta("El oráculo espera…", "");
  actualizarMarcador();
  inputIntento.focus();
}

function generarSecreto(max) {
  return Math.floor(Math.random() * max) + 1;
}

function esIntentoValido(texto, numero) {
  return texto !== "" && Number.isInteger(numero) && numero >= 1 && numero <= maximo;
}

// La temperatura depende de lo lejos que estés, en proporción al rango:
// estar a 10 de distancia no es lo mismo en 1–50 que en 1–500
function calcularTemperatura(numero) {
  const proporcion = Math.abs(numero - secreto) / maximo;

  if (proporcion === 0) return { clase: "acertado", mensaje: "¡Correcto!" };
  if (proporcion <= 0.03) return { clase: "ardiendo", mensaje: "¡Te estás quemando!" };
  if (proporcion <= 0.08) return { clase: "caliente", mensaje: "Caliente" };
  if (proporcion <= 0.15) return { clase: "templado", mensaje: "Templado" };
  if (proporcion <= 0.3) return { clase: "frio", mensaje: "Frío" };
  return { clase: "helado", mensaje: "Helado" };
}

function mostrarRespuesta(mensaje, clase) {
  respuesta.textContent = mensaje;
  respuesta.className = `respuesta ${clase}`;
}

function consultarOraculo(evento) {
  evento.preventDefault();

  const texto = inputIntento.value;
  const numero = Number(texto);

  if (!esIntentoValido(texto, numero)) {
    mostrarRespuesta(`Eso no es un número válido (1–${maximo})`, "error");
    return;
  }

  intentos++;
  const { clase, mensaje } = calcularTemperatura(numero);
  añadirAlHistorial(numero, clase);
  actualizarMarcador();

  if (clase === "acertado") {
    mostrarRespuesta(`${mensaje} Era el ${secreto} y lo encontraste en ${intentos} intentos`, clase);
    terminarPartida();
  } else if (intentos === intentosMaximos) {
    mostrarRespuesta(`Se acabaron los intentos. El número era el ${secreto}`, "derrota");
    terminarPartida();
  } else {
    mostrarRespuesta(mensaje, clase);
    inputIntento.value = "";
    inputIntento.focus();
  }
}

// Cada intento se convierte en una ficha del color de su temperatura
function añadirAlHistorial(numero, clase) {
  const ficha = document.createElement("li");
  ficha.textContent = numero;
  ficha.className = `ficha ${clase}`;
  historial.append(ficha);
}

function actualizarMarcador() {
  marcador.textContent = `Intentos: ${intentos} / ${intentosMaximos}`;
}

function terminarPartida() {
  inputIntento.disabled = true;
  botonConsultar.disabled = true;
}

// Tecla secreta: "n" de noche
function alternarModoNoche(evento) {
  if (evento.key.toLowerCase() === "n") {
    document.body.classList.toggle("modo-noche");
  }
}

formulario.addEventListener("submit", consultarOraculo);
botonNuevaPartida.addEventListener("click", nuevaPartida);
selectorDificultad.addEventListener("change", nuevaPartida);
document.addEventListener("keydown", alternarModoNoche);

nuevaPartida();
