/* ============================================================
   ⭐ CONTROL DE MÓDULOS DE SERVICIOS — ACCENTURE
   Cada módulo tiene su propia función:
   - iniciarModuloSoftware()
   - iniciarModuloAutomatizacion()
   - iniciarModuloAnalisis()
   - iniciarModuloFinancieros()
   - iniciarModuloContables()
   - iniciarModuloHeredados()
   ============================================================ */


/* ============================================================
   ⭐ FUNCIÓN BASE (UTILIZADA POR CADA MÓDULO)
   ============================================================ */
function iniciarModuloGenerico(idModulo) {

  const modulo = document.getElementById(idModulo);

  if (!modulo) {
    console.warn(`⚠ No existe el módulo con ID: ${idModulo}`);
    return;
  }

  // Esperar a que el módulo esté visible
  function esperarModulo() {
    const slidesContainer = modulo.querySelector(".slides-container");
    const slides = modulo.querySelectorAll(".slide");

    if (!slidesContainer || slides.length === 0) {
      setTimeout(esperarModulo, 80);
      return;
    }

    // SLIDE CONTROL
    let currentSlide = 0;

    modulo.querySelector(".slide-right").onclick = () => {
      currentSlide = 1;
      slidesContainer.style.transform = "translateX(-50%)";
      activarCapsulas(slides[1]);
    };

    modulo.querySelector(".slide-left").onclick = () => {
      currentSlide = 0;
      slidesContainer.style.transform = "translateX(0%)";
      activarCapsulas(slides[0]);
    };

    // ⭐ ANIMACIÓN SECUENCIAL DE CÁPSULAS
    function activarCapsulas(slide) {
      const capsulas = slide.querySelectorAll(".capsula");

      capsulas.forEach((capsula, i) => {
        setTimeout(() => {
          capsula.classList.add("visible");

          // activar barras
          capsula.querySelectorAll(".bar span").forEach(bar => {
            bar.style.width = bar.dataset.width;
          });

        }, i * 150); // 0.15s entre cápsulas
      });
    }

    // Activar cápsulas de la primera pantalla
    activarCapsulas(slides[0]);
  }

  esperarModulo();
}


/* ============================================================
   ⭐ FUNCIONES POR MÓDULO
   ============================================================ */

function iniciarModuloSoftware() {
  iniciarModuloGenerico("modulo-software");
}

function iniciarModuloAutomatizacion() {
  iniciarModuloGenerico("modulo-automatizacion");
}

function iniciarModuloAnalisis() {
  iniciarModuloGenerico("modulo-analisis");
}

function iniciarModuloFinancieros() {
  iniciarModuloGenerico("modulo-financieros");
}

function iniciarModuloContables() {
  iniciarModuloGenerico("modulo-contables");
}

function iniciarModuloHeredados() {
  iniciarModuloGenerico("modulo-heredados");
}


/* ============================================================
   ⭐ FUNCIÓN PARA ABRIR MÓDULOS
   ============================================================ */

function abrirModulo(idModulo) {
  const modulo = document.getElementById(idModulo);
  modulo.style.display = "flex";

  // Llamar la función correcta según el módulo
  switch (idModulo) {
    case "modulo-software":
      iniciarModuloSoftware();
      break;

    case "modulo-automatizacion":
      iniciarModuloAutomatizacion();
      break;

    case "modulo-analisis":
      iniciarModuloAnalisis();
      break;

    case "modulo-financieros":
      iniciarModuloFinancieros();
      break;

    case "modulo-contables":
      iniciarModuloContables();
      break;

    case "modulo-heredados":
      iniciarModuloHeredados();
      break;
  }
}


/* ============================================================
   ⭐ FUNCIÓN PARA CERRAR MÓDULOS
   ============================================================ */

function cerrarModulo(idModulo) {
  const modulo = document.getElementById(idModulo);
  modulo.style.display = "none";

  // limpiar estado visual
  modulo.querySelectorAll(".capsula").forEach(c => {
    c.classList.remove("visible");
  });

  modulo.querySelectorAll(".bar span").forEach(bar => {
    bar.style.width = "0";
  });

  modulo.querySelector(".slides-container").style.transform = "translateX(0%)";
}
