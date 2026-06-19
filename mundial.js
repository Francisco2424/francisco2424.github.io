// 🌍 mundial.js — Modo Mundial 2026

const API_BASE = "https://franciscomallea-automatizaciones-backend.onrender.com";

document.addEventListener("DOMContentLoaded", iniciarModoMundial);

function iniciarModoMundial() {
  console.log("✅ Modo Mundial 2026 iniciado correctamente.");
  mostrarGrupos();
}

// ============================
// 🔹 Obtener grupos del backend
// ============================
async function obtenerGrupos() {
  try {
    const url = `${API_BASE}/mundial/grupos`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn("⚠️ No se pudo obtener los grupos. Código:", res.status);
      return null;
    }

    return await res.json(); // Devuelve directamente un array
  } catch (error) {
    console.error("❌ Error al obtener los grupos:", error);
    return null;
  }
}

// ============================
// 🔹 Mostrar grupos en pantalla
// ============================
async function mostrarGrupos() {
  const contenedor = document.getElementById("contenedor-grupos");

  if (!contenedor) {
    console.error("❌ No existe el contenedor #contenedor-grupos");
    return;
  }

  contenedor.innerHTML = "<p>Cargando grupos del Mundial...</p>";

  const grupos = await obtenerGrupos();

  if (!grupos || !Array.isArray(grupos)) {
    contenedor.innerHTML = "<p>No se pudieron cargar los grupos.</p>";
    return;
  }

  contenedor.innerHTML = grupos.map(g => `
    <div class="grupo-card">
      <h3>Grupo ${g.grupo}</h3>

      <table class="tabla-grupo">
        <thead>
          <tr>
            <th>Selección</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          ${g.paises.map(p => `
            <tr>
              <td>${p.nombre}</td>
              <td>${p.pj}</td>
              <td>${p.pg}</td>
              <td>${p.pe}</td>
              <td>${p.pp}</td>
              <td>${p.gf}</td>
              <td>${p.gc}</td>
              <td>${p.dg}</td>
              <td><strong>${p.puntos}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `).join("");
}
