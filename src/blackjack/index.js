import _ from 'underscore';
import { creardeck, pedirCarta, valorCarta } from "./usescases";

const miModulo = (() => {
  "use strict";

  // Creacion de las variables, baraja, tipos y especiales.
  let deck = [];
  const tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  // Creaciacion del marcador del jugador y computadora.
  let puntosJugadores = [];

  //Referencias HTML
  const btnPedir = document.querySelector("#btnPedir"),
    btnDetener = document.querySelector("#btnDetener"),
    btnNuevo = document.querySelector("#btnNuevo");

  const divCartasJugadores = document.querySelectorAll(".divCartas"),
    puntosHTML = document.querySelectorAll("small"),
    mensajeElemento = document.querySelector("#mensaje");

    deck = creardeck( tipos, especiales );

  // Funcion de flecha que inicia el juego creando la baraja.
  const inicializarJuego = (numJugadores = 2) => {
    deck = creardeck( tipos, especiales );
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHTML.forEach((elem) => (elem.innerText = 0));
    divCartasJugadores.forEach((elem) => (elem.innerHTML = ""));
    mensajeElemento.innerHTML = "";

    btnPedir.disabled = false;
    btnDetener.disabled = false;
  };

  // Turno: 0 = Primer Jugador, ... Turno: ultimo = Computadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  };
  // Funcion de flecha que crea la imagen de las cartas
  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = "assets/cartas/" + carta + ".png";
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append(imgCarta);
  };

  // Funcion de flecha que determina el ganador del juego.
  const determinarGanador = () => {
    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        // alert('EMPATE');
        mostrarEmpate();
      } else if (puntosMinimos > 21) {
        // alert('LO SIENTO, PERDISTE');
        mostrarDerrota();
      } else if (puntosComputadora > 21) {
        // alert('ENHORABUENA, GANASTE');
        mostrarVictoria();
      } else {
        // alert('LO SIENTO, PERDISTE');
        mostrarDerrota();
      }
    }, 100);
  };
  // Funcion de flecha que inicia el turno computadora.
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    do {
      const carta = pedirCarta( deck );
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    determinarGanador();
  };

  // Funcion de flecha que inicia el evento de pedir carta para el jugador.
  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta( deck );
    const puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      console.warn("Lo siento mucho, has perdido.");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn("Genial, has ganado.");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });

  // Funcion de flecha que inicia el evento de que el jugador se plante
  btnDetener.addEventListener("click", () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugadores[0]);
  });

  // Funcion de flecha que inicia el evento de un nuevo juego
  btnNuevo.addEventListener("click", () => {
    inicializarJuego();
  });

  // Función de flecha para mostrar el mensaje de victoria
  const mostrarVictoria = () => {
    mensajeElemento.innerHTML =
      "<div class='alert alert-success text-center'>¡Has ganado!</div>";
  };

  // Función de flecha para mostrar el mensaje de derrota
  const mostrarDerrota = () => {
    mensajeElemento.innerHTML =
      "<div class='alert alert-danger text-center'>¡Has perdido!</div>";
  };

  // Función de flecha para mostrar el mensaje de empate
  const mostrarEmpate = () => {
    mensajeElemento.innerHTML =
      "<div class='alert alert-warning text-center'>¡Empate!</div>";
  };
  return {
    nuevoJuego: inicializarJuego,
  };
})();
