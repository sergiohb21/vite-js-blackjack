  // Funcion de flecha que permite coger una carta de la baraja.
  export const pedirCarta = ( deck ) => {
    if (deck.length === 0) {
      throw "¡No hay cartas en la baraja!";
    }
    return deck.pop();
  };