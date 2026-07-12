// catalogo.js - versión robusta y profesional

const WHATSAPP_NUMBER = "56963485904"; // tu número sin + ni espacios
const MARGEN_SUGERIDO = 0.20;

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

      <p>Precio: <strong>${formatCLP(precioSugerido)}</strong></p>
      <p>${producto.stock_disponible ? 'Stock: ' + producto.stock_disponible : 'Sin stock'}</p>

      <div class="btns">

        <!-- Botón Consultar -->
        <a class="btn btn-info"
           href="formulario.html?producto=${encodeURIComponent(
             producto.sku_interno || producto.sku_proveedor || producto.id
           )}">
          Consultar
        </a>

        <!-- Botón Comprar (modal futurista) -->
        <button class="btn btn-info" onclick='abrirModal(${JSON.stringify(producto)})'>
          Comprar
        </button>

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


/* ===========================
   MODAL FUTURISTA
   =========================== */

function abrirModal(producto) {
    const modal = document.getElementById("modal-producto");
    const carousel = document.getElementById("modal-carousel");

    // Limpiar carrusel
    carousel.innerHTML = "";

    // Mostrar imagen principal local
    if (producto.imagen_url_hosting) {
        const imgPrincipal = document.createElement("img");
        imgPrincipal.src = producto.imagen_url_hosting;
        imgPrincipal.alt = producto.nombre;
        imgPrincipal.className = "carousel-img";
        carousel.appendChild(imgPrincipal);
    }

    // Agregar imágenes del proveedor (si existen)
    if (Array.isArray(producto.imagenes_proveedor)) {
        producto.imagenes_proveedor.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = producto.nombre;
            img.loading = "lazy";
            img.className = "carousel-img";
            carousel.appendChild(img);
        });
    }

    // Información del producto
    document.getElementById("modal-nombre").textContent = producto.nombre;
    document.getElementById("modal-sku").textContent = "SKU: " + (producto.sku_interno || producto.sku_proveedor);
    document.getElementById("modal-precio").textContent = "Precio: " + formatCLP(calcularPrecioSugerido(producto.precio_proveedor));
    document.getElementById("modal-stock").textContent = producto.stock_disponible ? "Stock: " + producto.stock_disponible : "Sin stock";
    document.getElementById("modal-despacho").textContent = "Despacho: " + (producto.dias_despacho || 3) + " días hábiles";

    // Descripción extendida
    document.getElementById("modal-descripcion").innerHTML = `
        <p>${producto.descripcion || "Producto técnico de alta calidad."}</p>
        <p><a href="${producto.url_producto_proveedor}" target="_blank">Ver ficha técnica completa</a></p>
    `;

    // WhatsApp del modal
    document.getElementById("modal-whatsapp").href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            "Hola, quiero comprar " + producto.nombre + " - SKU: " + (producto.sku_interno || producto.sku_proveedor)
        )}`;

    // Mostrar modal
    modal.classList.remove("oculto");

    // Activar carrusel automático
    iniciarCarrusel(carousel);
}

// Carrusel automático cada 3 segundos
function iniciarCarrusel(carousel) {
    const imgs = carousel.querySelectorAll(".carousel-img");
    let index = 0;

    if (imgs.length <= 1) return; // si hay una sola imagen, no se mueve

    imgs.forEach((img, i) => {
        img.style.opacity = i === 0 ? "1" : "0";
    });

    setInterval(() => {
        imgs[index].style.opacity = "0";
        index = (index + 1) % imgs.length;
        imgs[index].style.opacity = "1";
    }, 3000);
}

// Cerrar modal con animación futurista
document.querySelector(".modal-close").addEventListener("click", () => {
    const modal = document.getElementById("modal-producto");
    const content = modal.querySelector(".modal-content");

    content.style.animation = "modalFadeOut 0.3s ease forwards";

    setTimeout(() => {
        modal.classList.add("oculto");
        content.style.animation = "modalFadeIn 0.35s ease forwards";
    }, 300);
});

// Botón pagar → despliega panel futurista
document.getElementById("modal-pago").addEventListener("click", () => {
    document.getElementById("panel-pago").classList.toggle("oculto");
});
