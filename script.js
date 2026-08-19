/* =========================================================
   VARIABLES
========================================================= */

let datos = null;

let indiceActual = 0;

let intervaloCarrusel;


/* =========================================================
   ELEMENTOS DEL HTML
========================================================= */

const contenedorTarjetas =
    document.getElementById("contenedor-tarjetas");

const indicadores =
    document.getElementById("indicadores");

const galeria =
    document.getElementById("galeria-contenedor");

const botonAnterior =
    document.getElementById("anterior");

const botonSiguiente =
    document.getElementById("siguiente");

const modal =
    document.getElementById("ventana-informacion");

const cerrarModal =
    document.getElementById("cerrar-modal");

const tituloModal =
    document.getElementById("titulo-modal");

const textoModal =
    document.getElementById("texto-modal");

const cita =
    document.getElementById("cita");

const botonNuevaCita =
    document.getElementById("nueva-cita");



/* =========================================================
   CARGAR JSON
========================================================= */

async function cargarDatos() {

    try {

        const respuesta =
            await fetch("Content.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar contenido.json"
            );

        }

        datos = await respuesta.json();

        crearCarrusel();

        crearGaleria();

        generarCita();

    }

    catch (error) {

        console.error(
            "Error al cargar el JSON:",
            error
        );

        cita.textContent =
            "No se pudieron cargar los datos.";

    }

}



/* =========================================================
   CREAR CARRUSEL
========================================================= */

function crearCarrusel() {

    contenedorTarjetas.innerHTML = "";

    indicadores.innerHTML = "";


    datos.tecnologias.forEach(
        (tecnologia, indice) => {


            /* ==========================
               TARJETA
            ========================== */

            const tarjeta =
                document.createElement("div");

            tarjeta.className =
                "tarjeta-carrusel";


            if (indice === 0) {

                tarjeta.classList.add("activa");

            }


            tarjeta.innerHTML = `

                <div class="icono">

                    ${tecnologia.icono}

                </div>

                <h3>

                    ${tecnologia.nombre}

                </h3>

                <p>

                    ${tecnologia.descripcion}

                </p>

            `;


            contenedorTarjetas.appendChild(tarjeta);



            /* ==========================
               INDICADOR
            ========================== */

            const indicador =
                document.createElement("span");

            indicador.className =
                "indicador";


            if (indice === 0) {

                indicador.classList.add("activo");

            }


            indicador.addEventListener(
                "click",
                () => {

                    mostrarTarjeta(indice);

                }
            );


            indicadores.appendChild(indicador);

        }
    );



    iniciarCarruselAutomatico();

}



/* =========================================================
   MOSTRAR TARJETA
========================================================= */

function mostrarTarjeta(indice) {

    const tarjetas =
        document.querySelectorAll(
            ".tarjeta-carrusel"
        );

    const puntos =
        document.querySelectorAll(
            ".indicador"
        );


    if (indice < 0) {

        indice =
            tarjetas.length - 1;

    }


    if (indice >= tarjetas.length) {

        indice = 0;

    }


    tarjetas.forEach(
        tarjeta => {

            tarjeta.classList.remove(
                "activa"
            );

        }
    );


    puntos.forEach(
        punto => {

            punto.classList.remove(
                "activo"
            );

        }
    );


    tarjetas[indice].classList.add(
        "activa"
    );


    puntos[indice].classList.add(
        "activo"
    );


    indiceActual = indice;

}



/* =========================================================
   BOTÓN ANTERIOR
========================================================= */

botonAnterior.addEventListener(
    "click",
    () => {

        mostrarTarjeta(
            indiceActual - 1
        );

        reiniciarCarrusel();

    }
);



/* =========================================================
   BOTÓN SIGUIENTE
========================================================= */

botonSiguiente.addEventListener(
    "click",
    () => {

        mostrarTarjeta(
            indiceActual + 1
        );

        reiniciarCarrusel();

    }
);



/* =========================================================
   CARRUSEL AUTOMÁTICO
========================================================= */

function iniciarCarruselAutomatico() {

    intervaloCarrusel =
        setInterval(
            () => {

                mostrarTarjeta(
                    indiceActual + 1
                );

            },
            5000
        );

}



function reiniciarCarrusel() {

    clearInterval(
        intervaloCarrusel
    );

    iniciarCarruselAutomatico();

}



/* =========================================================
   CREAR GALERÍA
========================================================= */

function crearGaleria() {

    galeria.innerHTML = "";


    datos.tecnologias.forEach(
        (tecnologia) => {


            const tarjeta =
                document.createElement("div");

             tarjeta.className =
                "imagen-galeria elemento-scroll";

            tarjeta.dataset.titulo =
                tecnologia.nombre;


            tarjeta.dataset.informacion =
                tecnologia.descripcion;


            tarjeta.innerHTML = `

                <img
                    src="${tecnologia.imagen}"
                    alt="${tecnologia.nombre}"
                >

                <div class="texto-imagen">

                    <h3>

                        ${tecnologia.nombre}

                    </h3>

                    <p>

                        Haz clic para saber más

                    </p>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                () => {

                    abrirModal(
                        tecnologia.nombre,
                        tecnologia.descripcion,
                    );

                }
            );


            galeria.appendChild(tarjeta);

        }
    );


    /* Activar animaciones
       de las nuevas tarjetas */

    activarAnimacionesScroll();

}



/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(
    titulo,
    informacion
) 

{
    tituloModal.textContent =
        titulo;

    textoModal.textContent =
        informacion;

    modal.classList.add(
        "mostrar"
    );

}



/* =========================================================
   CERRAR MODAL
========================================================= */

cerrarModal.addEventListener(
    "click",
    () => {

        modal.classList.remove(
            "mostrar"
        );

    }
);



/* =========================================================
   CERRAR MODAL AL HACER CLIC AFUERA
========================================================= */

modal.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === modal
        ) {

            modal.classList.remove(
                "mostrar"
            );

        }

    }
);



/* =========================================================
   CERRAR MODAL CON ESC
========================================================= */

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "Escape"
        ) {

            modal.classList.remove(
                "mostrar"
            );

        }

    }
);



/* =========================================================
   GENERADOR DE CITAS
========================================================= */

function generarCita() {

    if (
        !datos ||
        !datos.citas ||
        datos.citas.length === 0
    ) {

        return;

    }


    const numero =
        Math.floor(
            Math.random() *
            datos.citas.length
        );


    cita.style.opacity = "0";

    cita.style.transform =
        "translateY(15px)";


    setTimeout(
        () => {

            cita.textContent =
                datos.citas[numero];

            cita.style.opacity = "1";

            cita.style.transform =
                "translateY(0)";

        },
        300
    );

}



/* =========================================================
   BOTÓN NUEVA CITA
========================================================= */

botonNuevaCita.addEventListener(
    "click",
    generarCita
);



/* =========================================================
   ANIMACIONES DE SCROLL
========================================================= */

let observador;


function activarAnimacionesScroll() {

    const elementos =
        document.querySelectorAll(
            ".elemento-scroll"
        );


    if (observador) {

        observador.disconnect();

    }


    observador =
        new IntersectionObserver(

            (elementosObservados) => {

                elementosObservados.forEach(
                    (elemento) => {

                        if (
                            elemento.isIntersecting
                        ) {

                            elemento.target.classList.add(
                                "visible"
                            );

                        }

                        else {

                            /*
                             * Al salir de la pantalla
                             * quitamos la animación.
                             *
                             * Así vuelve a aparecer
                             * cuando regresamos.
                             */

                            elemento.target.classList.remove(
                                "visible"
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    elementos.forEach(
        elemento => {

            observador.observe(
                elemento
            );

        }
    );

}



/* =========================================================
   MOVIMIENTO DE PARTÍCULAS CON SCROLL
========================================================= */

const particulas =
    document.querySelectorAll(
        ".particula"
    );


window.addEventListener(
    "scroll",
    () => {

        const desplazamiento =
            window.scrollY;


        particulas.forEach(
            (particula, indice) => {

                const velocidad =
                    (indice + 1) * 0.02;


                particula.style.marginTop =
                    `${desplazamiento * velocidad}px`;

            }
        );

    }
);



/* =========================================================
   INICIAR TODO
========================================================= */

cargarDatos();

activarAnimacionesScroll();
