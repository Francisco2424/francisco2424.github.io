// catalogo.js - versión robusta y profesional

const WHATSAPP_NUMBER = "56963485904"; // tu número sin + ni espacios
const MARGEN_SUGERIDO = 0.40;

// --- Utilidades ---
function formatCLP(n) {
  if (n === null || n === undefined) return "-";
  return Number(n).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

function calcularPrecioSugerido(precioProveedor, margen = MARGEN_SUGERIDO) {
  const p = Number(precioProveedor || 0);
  return Math.round(p * (1 + margen));
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --- Crear tarjeta ---
function crearTarjeta(producto) {
  try {
    const imgSrc = producto.imagen_url_hosting || producto.imagen_url_proveedor || "placeholder.jpg";
    const precioProveedor = Number(producto.precio_proveedor || 0);
    const precioSugerido = calcularPrecioSugerido(precioProveedor);

    const cont = document.createElement("div");
    cont.className = "producto";

    cont.innerHTML = `
      <div class="img-wrap">
        <img class="producto-img"
             src="${escapeHtml(imgSrc)}"
             alt="${escapeHtml(producto.nombre)}"
             loading="lazy"
             onerror="this.onerror=null;this.src='placeholder.jpg'">
      </div>

      <h3 class="producto-nombre">${escapeHtml(producto.nombre)}</h3>
      <p class="producto-sku">SKU: ${escapeHtml(producto.sku_interno || producto.sku_proveedor || '')}</p>

      <!-- Ver en proveedor ocultado -->
      <!-- Precio del proveedor ocultado -->
      <!-- Proveedor: ocultado -->

      <p>Precio: <strong>${formatCLP(precioSugerido)}</strong></p>

      <p>${producto.stock_disponible ? 'Stock: ' + producto.stock_disponible : 'Sin stock'}</p>

      <div class="btns">
        <a class="btn btn-whatsapp"
           href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero consultar por ' + producto.nombre + ' - SKU: ' + (producto.sku_interno || producto.sku_proveedor))}"
           target="_blank">
          WhatsApp
        </a>

        <a class="btn btn-info"
           href="formulario.html?producto=${encodeURIComponent(producto.sku_interno || producto.sku_proveedor || producto.id)}">
          Consultar
        </a>
      </div>
    `;

    return cont;

  } catch (err) {
    console.error("Error creando tarjeta:", err, producto);
    return crearTarjetaFallback(producto);
  }
}

// --- Tarjeta fallback ---
function crearTarjetaFallback(producto) {
  const cont = document.createElement("div");
  cont.className = "producto";

  cont.innerHTML = `
    <div class="img-wrap">
      <div class="img-placeholder">Sin imagen válida</div>
    </div>
    <h3>${escapeHtml(producto.nombre || "Producto")}</h3>
    <p>SKU: ${escapeHtml(producto.sku_interno || producto.sku_proveedor || "N/A")}</p>
  `;

  return cont;
}

// --- Cargar catálogo ---
async function initCatalogo() {
  const cont = document.getElementById("catalogo");
  if (!cont) return console.error("No se encontró #catalogo");

  try {
    console.log("Cargando JSON desde:", window.location.origin + "/json/interno.json");

    const res = await fetch("json/interno.json", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Error HTTP " + res.status);
    }

    const productosRaw = await res.json();
    const productos = Array.isArray(productosRaw) ? productosRaw : [productosRaw];

    if (productos.length === 0) {
      cont.innerHTML = "<p>No hay productos para mostrar.</p>";
      return;
    }

    productos.forEach(p => cont.appendChild(crearTarjeta(p)));

  } catch (err) {
    console.error("Error cargando catálogo:", err);
    cont.innerHTML = `<p>Error cargando catálogo: ${escapeHtml(err.message)}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", initCatalogo);
