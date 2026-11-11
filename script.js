
/* ==========================
   CAMBIO DE FONDO
========================== */

const colores = [
  "#f3ebdd",
  "#eee2cc",
  "#f8f0e1",
  "#e9dfcc"
];

let indice = 0;

document.getElementById("colore").addEventListener(
  "click",
  () => {
    indice = (indice + 1) % colores.length;

    document.body.style.backgroundColor =
      colores[indice];
  }
);


/* ==========================
   LÍNEA DEL TIEMPO
========================== */

document.querySelectorAll(".evento").forEach(
  boton => {

    boton.addEventListener("click", () => {

      document.querySelectorAll(".evento").forEach(
        elemento => {
          elemento.classList.remove("attivo");
        }
      );

      boton.classList.add("attivo");

      document.getElementById("evento-info")
        .textContent = boton.dataset.info;

    });

  }
);


/* ==========================
   TARJETAS DE AUTORES
========================== */

const carte = [
  [
    "Chi ha scritto il Morgante?",
    "Luigi Pulci."
  ],
  [
    "Chi ha scritto l'Orlando innamorato?",
    "Matteo Maria Boiardo."
  ],
  [
    "Chi ha scritto l'Orlando furioso?",
    "Ludovico Ariosto."
  ],
  [
    "Chi ha scritto il Trionfo di Bacco e Arianna?",
    "Lorenzo de' Medici."
  ],
  [
    "Chi ha scritto Il Principe?",
    "Niccolò Machiavelli."
  ]
];

let carta = 0;

function aggiornaCarta() {

  document.getElementById("carta-contatore")
    .textContent =
      `Carta ${carta + 1} di ${carte.length}`;

  document.getElementById("carta-domanda")
    .textContent = carte[carta][0];

  document.getElementById("carta-risposta")
    .textContent = carte[carta][1];

  document.getElementById("carta-risposta")
    .hidden = true;

  document.getElementById("rivela")
    .textContent = "Mostra risposta";
}

document.getElementById("rivela").addEventListener(
  "click",
  () => {

    const respuesta =
      document.getElementById("carta-risposta");

    respuesta.hidden = !respuesta.hidden;

    document.getElementById("rivela")
      .textContent = respuesta.hidden
        ? "Mostra risposta"
        : "Nascondi risposta";
  }
);

document.getElementById("prossima").addEventListener(
  "click",
  () => {

    carta = (carta + 1) % carte.length;

    aggiornaCarta();
  }
);


/* ==========================
   RESPUESTAS DEL QUIZ
========================== */

const giuste = {
  q1: "b",
  q2: "a",
  q3: "c",
  q4: "b",
  q5: "a"
};

const spiegazioni = {
  q1: "L'Umanesimo studia criticamente i classici.",
  q2: "Il Certame Coronario fu promosso da Alberti.",
  q3: "Boiardo scrisse l'Orlando innamorato.",
  q4: "Il Principe è di Machiavelli.",
  q5: "Il Gattamelata è opera di Donatello."
};


/* ==========================
   CORRECCIÓN DEL QUIZ
========================== */

const form = document.getElementById("quizForm");

form.addEventListener("submit", evento => {

  evento.preventDefault();

  const resultado =
    document.getElementById("resultado");

  const detalle =
    document.getElementById("detalle");

  detalle.replaceChildren();

  // Verificar que estén todas respondidas

  for (let i = 1; i <= 5; i++) {

    const respuesta = form.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (!respuesta) {

      resultado.textContent =
        "Rispondi a tutte le domande prima di correggere.";

      return;
    }
  }

  // Calcular puntuación

  let puntos = 0;

  for (let i = 1; i <= 5; i++) {

    const pregunta = `q${i}`;

    const respuesta = form.querySelector(
      `input[name="${pregunta}"]:checked`
    ).value;

    const correcta =
      respuesta === giuste[pregunta];

    if (correcta) {
      puntos++;
    }

    const parrafo =
      document.createElement("p");

    if (correcta) {

      parrafo.textContent =
        `✓ Domanda ${i}: corretta!`;

    } else {

      parrafo.textContent =
        `✗ Domanda ${i}: ${spiegazioni[pregunta]}`;
    }

    detalle.appendChild(parrafo);
  }

  // Mostrar resultado

  let mensaje;

  if (puntos === 5) {

    mensaje = "Eccellente!";

  } else if (puntos >= 3) {

    mensaje = "Molto bene!";

  } else {

    mensaje = "Riprova dopo il ripasso!";
  }

  resultado.textContent =
    `Hai ottenuto ${puntos}/5 punti. ${mensaje}`;

});


/* ==========================
   REINICIAR QUIZ
========================== */

form.addEventListener("reset", () => {

  document.getElementById("resultado")
    .textContent = "";

  document.getElementById("detalle")
    .replaceChildren();

});
