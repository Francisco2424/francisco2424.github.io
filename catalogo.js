// Carga el JSON público
fetch("publico.json")
    .then(response => response.json())
    .then(data => cargarCatalogo(data))
    .catch(err => console.error("Error cargando publico.json:", err));

function cargarCatalogo(productos) {
    const contenedor = document.getElementById("catalogo");

    productos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("producto");

        const precioFormateado = p.precio.toLocaleString("es-CL");

        div.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p class="precio">$${precioFormateado}</p>

            <div class="btns">
                <a class="btn btn-whatsapp"
                   href="https://wa.me/56912345678?text=Hola,%20quiero%20consultar%20por%20${encodeURIComponent(p.nombre)}"
                   target="_blank">
                    WhatsApp
                </a>

                <a class="btn btn-info"
                   href="formulario.html?producto=${p.id}">
                    Consultar
                </a>
            </div>
        `;

        contenedor.appendChild(div);
    });
}
