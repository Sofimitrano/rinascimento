
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

    let nuevoIndice;

    do {
        nuevoIndice = Math.floor(
            Math.random() * colores.length
        );
    } while (
        nuevoIndice === indiceColor &&
        colores.length > 1
    );

    indiceColor = nuevoIndice;

    document.body.style.backgroundColor =
        colores[indiceColor];
}


/* ==============================
   LETTORE PDF
============================== */

let documentoPDF = null;
let paginaActual = 1;
let zoom = 1.2;
let renderActual = null;
let renderEnCurso = false;
let renderPendiente = false;

async function cargarPDF() {

    const mensaje =
        document.getElementById("mensajePDF");

    if (typeof pdfjsLib === "undefined") {
        mensaje.textContent =
            "Impossibile caricare il lettore PDF.";
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    try {

        documentoPDF = await pdfjsLib.getDocument(
            "rinascimento.pdf"
        ).promise;

        paginaActual = 1;

        await mostrarPagina();

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "Documento non trovato. Controlla che rinascimento.pdf sia nella stessa cartella di index.html.";
    }
}

async function mostrarPagina() {

    if (!documentoPDF) return;

    if (renderEnCurso) {
        renderPendiente = true;
        return;
    }

    renderEnCurso = true;

    const numero = paginaActual;
    const escala = zoom;

    const canvas =
        document.getElementById("paginaPDF");

    const contexto = canvas.getContext("2d");

    const mensaje =
        document.getElementById("mensajePDF");

    try {

        const pagina = await documentoPDF.getPage(numero);

        const viewport = pagina.getViewport({
            scale: escala
        });

        const proporcion =
            window.devicePixelRatio || 1;

        canvas.width =
            Math.floor(viewport.width * proporcion);

        canvas.height =
            Math.floor(viewport.height * proporcion);

        canvas.style.width =
            viewport.width + "px";

        canvas.style.height =
            viewport.height + "px";

        contexto.setTransform(1, 0, 0, 1, 0, 0);

        contexto.scale(proporcion, proporcion);

        renderActual = pagina.render({
            canvasContext: contexto,
            viewport: viewport
        });

        await renderActual.promise;

        mensaje.hidden = true;

        document.getElementById("contadorPagina")
            .textContent =
            `Pagina ${numero} di ${documentoPDF.numPages}`;

    } catch (error) {

        console.error(error);

        mensaje.hidden = false;

        mensaje.textContent =
            "Errore durante la visualizzazione.";

    } finally {

        renderActual = null;
        renderEnCurso = false;

        if (renderPendiente) {
            renderPendiente = false;
            mostrarPagina();
        }
    }
}

function irPagina(numero) {

    if (!documentoPDF) return;

    paginaActual = Math.max(
        1,
        Math.min(numero, documentoPDF.numPages)
    );

    document.getElementById("documento")
        .scrollIntoView({
            behavior: "smooth"
        });

    mostrarPagina();
}

function paginaAnterior() {

    if (!documentoPDF || paginaActual <= 1) return;

    paginaActual--;
    mostrarPagina();
}

function paginaSiguiente() {

    if (
        !documentoPDF ||
        paginaActual >= documentoPDF.numPages
    ) return;

    paginaActual++;
    mostrarPagina();
}

function cambiarZoom(cambio) {

    zoom = Math.max(
        0.6,
        Math.min(2.5, zoom + cambio)
    );

    mostrarPagina();
}


/* ==============================
   CORREGGERE IL QUIZ
============================== */

const respuestasCorrectas = {
    pregunta1: "b",
    pregunta2: "a",
    pregunta3: "c",
    pregunta4: "b",
    pregunta5: "a"
};

const explicaciones = {
    pregunta1:
        "L'Umanesimo è un movimento letterario e filologico.",

    pregunta2:
        "Il mecenatismo consiste nel finanziamento delle arti.",

    pregunta3:
        "Leon Battista Alberti organizzò il Certame Coronario nel 1441.",

    pregunta4:
        "Ludovico Ariosto scrisse l'Orlando furioso.",

    pregunta5:
        "Machiavelli studia la realtà politica concreta."
};

function corregirQuiz() {

    let puntos = 0;

    const resultado =
        document.getElementById("resultado");

    const detalles =
        document.getElementById("explicaciones");

    detalles.replaceChildren();

    // Verificare le risposte

    for (let i = 1; i <= 5; i++) {

        const respuesta = document.querySelector(
            `input[name="pregunta${i}"]:checked`
        );

        if (!respuesta) {

            resultado.textContent =
                "✧ Rispondi a tutte le domande.";

            return;
        }
    }

    // Calcolare il punteggio

    for (let i = 1; i <= 5; i++) {

        const nombre = `pregunta${i}`;

        const respuesta = document.querySelector(
            `input[name="${nombre}"]:checked`
        );

        const correcto =
            respuesta.value === respuestasCorrectas[nombre];

        const parrafo =
            document.createElement("p");

        if (correcto) {

            puntos++;

            parrafo.textContent =
                `✓ Domanda ${i}: corretta!`;

        } else {

            parrafo.textContent =
                `✗ Domanda ${i}: ${explicaciones[nombre]}`;
        }

        detalles.appendChild(parrafo);
    }

    // Risultato finale

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
   INIZIALIZZAZIONE
============================== */

document.addEventListener("DOMContentLoaded", () => {

    cargarPDF();

    const formulario =
        document.getElementById("quizForm");

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

        corregirQuiz();
    });

    formulario.addEventListener("reset", () => {

        document.getElementById("resultado")
            .textContent = "";

        document.getElementById("explicaciones")
            .replaceChildren();
    });

});
