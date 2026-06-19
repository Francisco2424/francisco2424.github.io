// 🌍 mundial.js — JS principal del Modo Mundial 2026

// ------------------------------------------------------------
// 1. URL base del backend
// ------------------------------------------------------------
const API_BASE = "https://franciscomallea-automatizaciones-backend.onrender.com";

// ------------------------------------------------------------
// 2. Inicialización del módulo
// ------------------------------------------------------------
function iniciarModoMundial() {
  console.log("✅ Modo Mundial 2026 iniciado correctamente.");
  mostrarGrupos(); // Carga segura y no bloqueante
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", iniciarModoMundial);

// ------------------------------------------------------------
// 3. Obtener grupos del backend (seguro y no bloqueante)
// ------------------------------------------------------------
async function obtenerGrupos() {
  try {
    const url = `${API_BASE}/mundial/grupos`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn("⚠️ No se pudo obtener los grupos. Código:", res.status);
      return null;
    }

    const data = await res.json();
    return data; // data.grupos es el array real
  } catch (error) {
    console.error("❌ Error al obtener los grupos:", error);
    return null;
  }
}

// ------------------------------------------------------------
// 4. Renderizar grupos en el contenedor
// ------------------------------------------------------------
async function mostrarGrupos() {
  const contenedor = document.getElementById("contenedor-grupos");

  if (!contenedor) {
    console.error("❌ No existe el contenedor #contenedor-grupos");
    return;
  }

  contenedor.innerHTML = "<p>Cargando grupos del Mundial...</p>";

  const respuesta = await obtenerGrupos();

  if (!respuesta || !respuesta.grupos) {
    contenedor.innerHTML = "<p>No se pudieron cargar los grupos en este momento.</p>";
    return;
  }

  // Renderizado seguro y dinámico
  contenedor.innerHTML = respuesta.grupos.map(g => {
    const equipos = Array.isArray(g.equipos) ? g.equipos : [];
    return `
      <div class="grupo-card">
        <h3>${g.grupo}</h3>
        <ul>
          ${equipos.map(equipo => `<li>${equipo}</li>`).join("")}
        </ul>
      </div>
    `;
  }).join("");
}
