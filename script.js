console.log("Página cargada correctamente (versión futurista).");

// Ajustar altura de imágenes laterales según el alto del texto
function ajustarAlturaQuienSoy() {
  const texto = document.querySelector(".quien-soy-text");
  if (!texto) return;

  const altura = texto.offsetHeight;
  document.documentElement.style.setProperty("--quien-text-height", altura + "px");
}

// Mostrar sección "Quién Soy" con animaciones sincronizadas
document.getElementById("btn-quien-soy").addEventListener("click", function() {

  // Ocultar todas las secciones
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");

  // Mostrar sección "Quién Soy"
  const section = document.getElementById("quien-soy");
  section.style.display = "block";

  // Reiniciar animación del texto
  const txt = document.querySelector(".quien-soy-text");
  txt.classList.remove("animate-entry");
  void txt.offsetWidth;
  txt.classList.add("animate-entry");

  // Reiniciar animación lateral de imágenes
  document.querySelectorAll(".quien-img-side").forEach(img => {
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  });

  // Ajustar altura de imágenes después de que el texto esté visible
  setTimeout(ajustarAlturaQuienSoy, 80);
});

// Recalcular altura si la ventana cambia (móviles, tablets, zoom)
window.addEventListener("resize", () => {
  ajustarAlturaQuienSoy();
});
