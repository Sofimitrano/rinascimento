
/* ==============================
   CAMBIARE COLORE DI SFONDO
============================== */

const colores = [
    "#f3ebdd",
    "#eee2cc",
    "#f8f0e1",
    "#e9dfcc",
    "#f5e9d7",
    "#e8dfd0"
];

let indiceColor = 0;

function cambiarColor() {

    const colorAnterior = indiceColor;

    do {
        indiceColor = Math.floor(
            Math.random() * colores.length
        );
    } while (
        indiceColor === colorAnterior &&
        colores.length > 1
    );

    document.body.style.backgroundColor =
        colores[indiceColor];
}


/* ==============================
   CORREGGERE IL QUIZ
============================== */

const respuestasCorrectas = {
    pregunta1: "b",
    pregunta2: "a",
    pregunta3: "c",
    pregunta4: "b",
    pregunta5: "c"
};

const explicaciones = {
    pregunta1:
        "L'Umanesimo è un movimento letterario e filologico.",

    pregunta2:
        "Il mecenatismo consiste nel finanziamento delle arti.",

    pregunta3:
        "Leon Battista Alberti organizzò il Certame Coronario nel 1441.",

    pregunta4:
        "Ludovico Ariosto è l'autore dell'Orlando furioso.",

    pregunta5:
        "Machiavelli studia la realtà politica concreta."
};

function corregirQuiz() {

    let puntos = 0;
    let preguntasSinResponder = [];

    const resultado =
        document.getElementById("resultado");

    const detalle =
        document.getElementById("detalle");

    detalle.replaceChildren();

    // Controllare tutte le risposte

    for (let i = 1; i <= 5; i++) {

        const respuesta = document.querySelector(
            `input[name="pregunta${i}"]:checked`
        );

        if (!respuesta) {
            preguntasSinResponder.push(i);
        }
    }

    if (preguntasSinResponder.length > 0) {

        resultado.textContent =
            "✧ Rispondi a tutte le domande prima di continuare.";

        return;
    }

    // Calcolare il punteggio

    for (let i = 1; i <= 5; i++) {

        const nombre = `pregunta${i}`;

        const respuesta = document.querySelector(
            `input[name="${nombre}"]:checked`
        );

        const esCorrecta =
            respuesta.value === respuestasCorrectas[nombre];

        const parrafo = document.createElement("p");

        if (esCorrecta) {

            puntos++;

            parrafo.textContent =
                `✓ Domanda ${i}: corretta!`;

        } else {

            parrafo.textContent =
                `✗ Domanda ${i}: ${explicaciones[nombre]}`;
        }

        detalle.appendChild(parrafo);
    }

    // Mostrare il risultato finale

    if (puntos === 5) {

        resultado.textContent =
            "✦ Eccellente! 5/5. La tua conoscenza è fiorita!";

    } else if (puntos >= 3) {

        resultado.textContent =
            `❦ Molto bene! Hai ottenuto ${puntos}/5 punti.`;

    } else if (puntos >= 1) {

        resultado.textContent =
            `✧ Hai ottenuto ${puntos}/5 punti. Continua a studiare!`;

    } else {

        resultado.textContent =
            "📜 0/5. Rileggi i capitoli e riprova!";
    }
}


/* ==============================
   EVENTI DEL FORM
============================== */

document.addEventListener("DOMContentLoaded", () => {

    const formulario =
        document.getElementById("quizForm");

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        corregirQuiz();
    });

    formulario.addEventListener("reset", () => {

        document.getElementById("resultado")
            .textContent = "";

        document.getElementById("detalle")
            .replaceChildren();
    });

});
