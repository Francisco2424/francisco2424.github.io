/* ============================================================
   ⭐ CONTROL DE MÓDULOS DE SERVICIOS — ACCENTURE
   ============================================================ */

function iniciarModuloGenerico(idModulo) {

  const modulo = document.getElementById(idModulo);

  if (!modulo) {
    console.warn(`⚠ No existe el módulo con ID: ${idModulo}`);
    return;
  }

  /* ============================================================
     ⭐ ESPERAR A QUE EL MÓDULO ESTÉ VISIBLE
     ============================================================ */
  function esperarModulo() {
    const slidesContainer = modulo.querySelector(".slides-container");
    const slides = modulo.querySelectorAll(".slide");

    if (!slidesContainer || slides.length === 0) {
      setTimeout(esperarModulo, 80);
      return;
    }

    /* ============================================================
       ⭐ CONTROL DE SLIDES
       ============================================================ */
    let currentSlide = 0;
    const totalSlides = slides.length;

    const leftArrow = modulo.querySelector(".slide-left");
    const rightArrow = modulo.querySelector(".slide-right");

    /* ============================================================
       ⭐ FUNCIÓN PARA ACTUALIZAR FLECHAS
       ============================================================ */
    function actualizarFlechas() {
      leftArrow.style.display = currentSlide === 0 ? "none" : "block";
      rightArrow.style.display = currentSlide === totalSlides - 1 ? "none" : "block";
    }

    actualizarFlechas(); // inicial

    /* ============================================================
       ⭐ ANIMACIÓN SECUENCIAL DE CÁPSULAS
       ============================================================ */
    function activarCapsulas(slide) {
      const capsulas = slide.querySelectorAll(".capsula");

      capsulas.forEach((capsula, i) => {
        setTimeout(() => {
          capsula.classList.add("visible");

          // activar barras
          capsula.querySelectorAll(".bar span").forEach(bar => {
            bar.style.width = bar.dataset.width;
          });

        }, i * 150);
      });
    }

    activarCapsulas(slides[0]); // primera pantalla

    /* ============================================================
       ⭐ FLECHA DERECHA
       ============================================================ */
    rightArrow.onclick = () => {
      currentSlide = Math.min(currentSlide + 1, totalSlides - 1);
      slidesContainer.style.transform = `translateX(-${currentSlide * 50}%)`;
      activarCapsulas(slides[currentSlide]);
      actualizarFlechas();
    };

    /* ============================================================
       ⭐ FLECHA IZQUIERDA
       ============================================================ */
    leftArrow.onclick = () => {
      currentSlide = Math.max(currentSlide - 1, 0);
      slidesContainer.style.transform = `translateX(-${currentSlide * 50}%)`;
      activarCapsulas(slides[currentSlide]);
      actualizarFlechas();
    };
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

function cerrarModulo() {
  // Detecta el módulo donde está el botón
  const modulo = event.target.closest('.overlay-accenture');

  if (!modulo) return;

  // Oculta el módulo
  modulo.style.display = "none";

  // Limpia animaciones
  modulo.querySelectorAll(".capsula").forEach(c => {
    c.classList.remove("visible");
  });

  modulo.querySelectorAll(".bar span").forEach(bar => {
    bar.style.width = "0";
  });

  // Resetea slides
  const slidesContainer = modulo.querySelector(".slides-container");
  if (slidesContainer) {
    slidesContainer.style.transform = "translateX(0%)";
  }

  // Vuelve a la sección Servicios sin recargar
  document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
}
