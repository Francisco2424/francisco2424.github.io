// mundial.js — JS principal del Modo Mundial 2026

// 1. URL base del backend
const API_BASE = "https://franciscomallea-automatizaciones-backend.onrender.com";

// 2. Inicialización del módulo
function iniciarModoMundial() {
    console.log("✅ Modo Mundial 2026 iniciado correctamente.");
    mostrarGrupos(); // Carga segura y no bloqueante
}

// 3. Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", iniciarModoMundial);

// ------------------------------------------------------------
// 4. Obtener grupos del backend (seguro y no bloqueante)
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
        return data;

    } catch (error) {
        console.error("❌ Error al obtener los grupos:", error);
        return null;
    }
}

// ------------------------------------------------------------
// 5. Renderizar grupos en el contenedor
// ------------------------------------------------------------
async function mostrarGrupos() {
    const contenedor = document.getElementById("contenedor-grupos");

    if (!contenedor) {
        console.error("❌ No existe el contenedor #contenedor-grupos");
        return;
    }

    contenedor.innerHTML = "<p>Cargando grupos del Mundial...</p>";

    const grupos = await obtenerGrupos();

    if (!grupos) {
        contenedor.innerHTML = "<p>No se pudieron cargar los grupos en este momento.</p>";
        return;
    }

    contenedor.innerHTML = grupos.map(g => `
        <div class="grupo-card">
            <h3>${g.grupo}</h3>
            <ul>
                ${g.equipos.map(eq => `<li>${eq}</li>`).join("")}
            </ul>
        </div>
    `).join("");
}
