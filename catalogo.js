// catalogo.js - versión adaptada a json/interno.json (actualizada con tu número WhatsApp)
const WHATSAPP_NUMBER = "963485904"; // tu número sin + ni espacios
const MARGEN_SUGERIDO = 0.40; // 40% por defecto

async function fetchProductos() {
  const res = await fetch("json/interno.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar json/interno.json: " + res.status);
  return await res.json();
}

function formatCLP(n) {
  if (n === null || n === undefined) return "-";
  return Number(n).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
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

function crearTarjeta(producto) {
  const imgSrc = producto.imagen_url_hosting || producto.imagen_url_proveedor || "placeholder.jpg";
  const precioProveedor = Number(producto.precio_proveedor || 0);
  const precioSugerido = calcularPrecioSugerido(precioProveedor);

  const cont = document.createElement("div");
  cont.className = "producto";

  cont.innerHTML = `
    <div class="img-wrap">
      <img class="producto-img" src="${escapeHtml(imgSrc)}" alt="${escapeHtml(producto.nombre)}" loading="lazy"
           onerror="this.onerror=null;this.src='placeholder.jpg'">
    </div>

    <div class="producto-body">
      <h3 class="producto-nombre">${escapeHtml(producto.nombre)}</h3>
      <p class="producto-sku">SKU: ${escapeHtml(producto.sku_interno || producto.sku_proveedor || '')}</p>
      ${producto.url_producto_proveedor ? `<p class="producto-proveedor"><a href="${escapeHtml(producto.url_producto_proveedor)}" target="_blank" rel="noopener">Ver en proveedor</a></p>` : ""}
      <p class="producto-precio-proveedor">Proveedor: <strong>${formatCLP(precioProveedor)}</strong></p>
      <p class="producto-precio-sugerido">Sugerido: <strong>${formatCLP(precioSugerido)}</strong></p>
      <p class="producto-stock">${producto.stock_disponible ? 'Stock: ' + producto.stock_disponible : 'Sin stock'}</p>

      <div class="btns">
        <a class="btn btn-whatsapp"
           href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quiero consultar por ' + (producto.nombre || '') + ' - SKU: ' + (producto.sku_interno || producto.sku_proveedor || ''))}"
           target="_blank" rel="noopener">
          WhatsApp
        </a>

        <a class="btn btn-info"
           href="formulario.html?producto=${encodeURIComponent(producto.sku_interno || producto.sku_proveedor || producto.id || '')}">
          Consultar
        </a>
      </div>
    </div>
  `;

  return cont;
}

async function cargarCatalogo(productos) {
  const contenedor = document.getElementById("catalogo");
  if (!contenedor) return console.error("No se encontró el contenedor #catalogo");
  contenedor.innerHTML = "";

  productos.forEach(p => {
    if (!p || typeof p !== "object") return;
    contenedor.appendChild(crearTarjeta(p));
  });
}

async function initCatalogo() {
  const cont = document.getElementById("catalogo");
  if (!cont) return console.error("No se encontró el contenedor #catalogo");

  try {
    const productosRaw = await fetchProductos();
    const productos = Array.isArray(productosRaw) ? productosRaw : [productosRaw];

    if (productos.length === 0) {
      cont.innerHTML = "<p>No hay productos para mostrar.</p>";
      return;
    }

    cargarCatalogo(productos);
  } catch (err) {
    console.error(err);
    cont.innerHTML = `<p>Error cargando catálogo: ${escapeHtml(err.message)}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", initCatalogo);
