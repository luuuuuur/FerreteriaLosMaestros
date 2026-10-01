// Archivo de lógica para la página del carrito.
// Maneja la lectura, edición, eliminación y resumen del carrito guardado en LocalStorage.

document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
});

// 1. Obtiene el carrito guardado en LocalStorage.
function obtenerCarritoStorage() {
    return JSON.parse(localStorage.getItem("carrito_ferreteria")) || [];
}

// 2. Guarda el carrito y actualiza el contador del header.
function guardarCarritoStorage(carrito) {
    localStorage.setItem("carrito_ferreteria", JSON.stringify(carrito));
    actualizarContadorHeader();
}

function agregarCarrito(codigo, cantidad = 1) {
    let carrito = obtenerCarritoStorage();
    const prod = productos.find(p => p.codigo == codigo);

    // Si no encuentra producto
    if (!prod) {
        alert("Producto no encontrado.");
        return;
    }

    const index = carrito.findIndex(item => item.codigo === codigo);
    // Si es distinto de .1 del producto almacenado
    if (index !== -1) {
        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({
            codigo: prod.codigo,
            cantidad: cantidad,
            nombre: prod.nombre,
            imagen: `assets/Productos/${prod.codigo}.jpg`,
            precio: prod.precioVenta
        });
    }

    guardarCarritoStorage(carrito);
    alert("Producto añadido al carrito 🛒");
}

function obtenerRutaImagenProducto(codigo, extension = "jpg") {
    return `assets/Productos/${codigo}.${extension}`;
}

function cargarImagenAlternativaCarrito(imagen, codigo) {
    const extensiones = ["jpg", "webp", "png", "avif"];
    const extensionActual = imagen.dataset.extension || "jpg";
    const indiceActual = extensiones.indexOf(extensionActual);

    if (indiceActual < extensiones.length - 1) {
        const siguienteExtension = extensiones[indiceActual + 1];
        imagen.dataset.extension = siguienteExtension;
        imagen.src = obtenerRutaImagenProducto(codigo, siguienteExtension);
        return;
    }

    imagen.onerror = null;
    imagen.src = `https://via.placeholder.com/200x160?text=${codigo}`;
}

// 3. Renderiza la lista de productos dentro del carrito.
function renderizarCarrito() {
    const contenedor = document.getElementById("contenedor-items");
    const carrito = obtenerCarritoStorage();

    actualizarContadorHeader();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio-box">
                <h2>Tu carrito está vacío 🛒</h2>
                <p style="margin-top: 10px;">¡Explora nuestros productos de construcción y ferretería!</p>
                <a href="Producto.html" class="btn-volver">Ir a Productos</a>
            </div>
        `;
        actualizarTotales(0);
        return;
    }

    let subtotalGeneral = 0;

    let htmlHTML = "";

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        subtotalGeneral += subtotalItem;
        const imagenInicial = item.imagen || obtenerRutaImagenProducto(item.codigo, "jpg");
        const extensionInicial = imagenInicial.includes(".") ? imagenInicial.split(".").pop() : "jpg";

        htmlHTML += `
            <div class="item-carrito">
                <div class="item-imagen-box">
                    <img
                        src="${imagenInicial}"
                        alt="${item.nombre}"
                        data-codigo="${item.codigo}"
                        data-extension="${extensionInicial}"
                        onerror="cargarImagenAlternativaCarrito(this, '${item.codigo}')"
                    >
                </div>

                <div class="item-detalles">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio-unitario">${formatearCLP(item.precio)} c/u</div>
                </div>

                <div class="item-controles">
                    <input
                        type="number"
                        class="input-cantidad"
                        value="${item.cantidad}"
                        min="1"
                        onchange="cambiarCantidad('${item.codigo}', this.value)"
                    >
                </div>

                <div class="item-subtotal">${formatearCLP(subtotalItem)}</div>

                <button class="btn-eliminar" onclick="eliminarProducto('${item.codigo}')">
                    ✕
                </button>
            </div>
        `;
    });

    contenedor.innerHTML = htmlHTML;
    actualizarTotales(subtotalGeneral);
}


// 4. Cambia la cantidad de un producto en el carrito.
function cambiarCantidad(codigo, nuevaCantidad) {
    let carrito = obtenerCarritoStorage();
    const cant = parseInt(nuevaCantidad);

    if (isNaN(cant) || cant <= 0) {
        eliminarProducto(codigo);
        return;
    }

    carrito = carrito.map(item => {
        if (item.codigo === codigo) {
            item.cantidad = cant;
        }
        return item;
    });

    guardarCarritoStorage(carrito);
    renderizarCarrito();
}

// 5. Elimina un producto específico del carrito.
function eliminarProducto(codigo) {
    let carrito = obtenerCarritoStorage();
    carrito = carrito.filter(item => item.codigo !== codigo);
    guardarCarritoStorage(carrito);
    renderizarCarrito();
}

// 6. Vacía por completo el carrito del usuario.
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
        localStorage.removeItem("carrito_ferreteria");
        renderizarCarrito();
    }
}

// 7. Calcula y muestra el subtotal y el total del pedido.
function actualizarTotales(subtotal) {
    const costoEnvio = subtotal > 0 ? 3990 : 0;
    const total = subtotal + costoEnvio;

    document.getElementById("subtotal-precio").textContent = formatearCLP(subtotal);
    document.getElementById("total-precio").textContent = formatearCLP(total);
}

// 8. Actualiza la insignia del carrito en la barra superior.
function actualizarContadorHeader() {
    const carrito = obtenerCarritoStorage();
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const badge = document.getElementById("cart-count");
    if (badge) {
        badge.textContent = totalUnidades;
    }
}

// Helper: formatea montos en pesos chilenos.
function formatearCLP(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(monto);
}

// Acción del botón para proceder al pago.
function procesarPago() {
    const carrito = obtenerCarritoStorage();
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    alert("¡Gracias por tu compra! Redirigiendo a la pasarela de pago...");
}

function agregarAlCarrito(codigo, cantidad = 1) {
    let carrito = obtenerCarritoStorage();
    const prod = productos.find(p => p.codigo === codigo);

    if (!prod) {
        alert("Producto no encontrado.");
        return;
    }

    const index = carrito.findIndex(item => item.codigo === codigo);

    if (index !== -1) {
        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({
            codigo: prod.codigo,
            cantidad: cantidad,
            nombre: prod.nombre,
            imagen: prod.imagen || `assets/Productos/${prod.codigo}.jpg`,
            precio: prod.precioVenta
        });
    }

    guardarCarritoStorage(carrito);
    alert("Producto añadido al carrito correctamente 🛒");
}