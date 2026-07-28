console.log("Página cargada correctamente (versión futurista).");

// ⭐ ACTIVAR MÓDULO
function abrirModulo(id) {
  const modulo = document.getElementById(id);
  modulo.style.display = "flex";
  modulo.classList.add("beneficios-activos");

  reiniciarAnimacionesModulo(id);
  activarScrollStorytelling();
}

// ⭐ CERRAR MÓDULO
function cerrarModulo(id) {
  const modulo = document.getElementById(id);
  modulo.style.display = "none";
  modulo.classList.remove("beneficios-activos");
}

// ⭐ REINICIAR ANIMACIONES DE TARJETAS
function reiniciarAnimacionesModulo(id) {
  const modulo = document.getElementById(id);
  const tarjetas = modulo.querySelectorAll(".modulo-screen");

  tarjetas.forEach(t => {
    t.classList.remove("visible");
    void t.offsetWidth;
  });
}

// ⭐ ACTIVAR SCROLL-STORYTELLING
function activarScrollStorytelling() {
  const tarjetas = document.querySelectorAll(".modulo-screen");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.35 });

  tarjetas.forEach(t => observer.observe(t));
}

// ⭐ SECCIÓN QUIÉN SOY (tu código original)
function ajustarAlturaQuienSoy() {
  const texto = document.querySelector(".quien-soy-text");
  if (!texto) return;
  const altura = texto.offsetHeight;
  document.documentElement.style.setProperty("--quien-text-height", altura + "px");
}

document.getElementById("btn-quien-soy").addEventListener("click", function() {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");

  const section = document.getElementById("quien-soy");
  section.style.display = "block";

  const txt = document.querySelector(".quien-soy-text");
  txt.classList.remove("animate-entry");
  void txt.offsetWidth;
  txt.classList.add("animate-entry");

  document.querySelectorAll(".quien-img-side").forEach(img => {
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  });

  setTimeout(ajustarAlturaQuienSoy, 80);
});

// SLIDE CONTROL
let currentSlide = 0;
const slidesContainer = document.querySelector(".slides-container");

document.querySelector(".slide-right").onclick = () => {
  currentSlide = 1;
  slidesContainer.style.transform = "translateX(-50%)";
  activarCapsulas(1);
};

document.querySelector(".slide-left").onclick = () => {
  currentSlide = 0;
  slidesContainer.style.transform = "translateX(0%)";
  activarCapsulas(0);
};

// ⭐ ANIMACIÓN SECUENCIAL DE CÁPSULAS
function activarCapsulas(slideIndex) {
  const slide = document.querySelectorAll(".slide")[slideIndex];
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

// Activar cápsulas de la primera pantalla al abrir
activarCapsulas(0);
