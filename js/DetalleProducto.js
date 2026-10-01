// Archivo de lógica para la página de detalle de producto.
// Carga el producto seleccionado, muestra su información, obtiene
// productos relacionados y permite agregarlo al carrito.

const parametros = new URLSearchParams(window.location.search);
const codigoProducto = parametros.get("codigo");
const productoActual = productos.find(producto => producto.codigo === codigoProducto);

const formatoPrecio = new Intl.NumberFormat("es-CL", {
	style: "currency",
	currency: "CLP"
});

// Construye la ruta de la imagen del producto según el código y la extensión.
function rutaImagen(codigo, extension = "jpg") {
	return `assets/Productos/${codigo}.${extension}`;
}

function configurarImagen(imagen, codigo) {
	const extensiones = ["jpg", "webp", "png", "avif"];
	let indice = 0;

	imagen.src = rutaImagen(codigo, extensiones[indice]);
	imagen.onerror = () => {
		indice += 1;

		if (indice < extensiones.length) {
			imagen.src = rutaImagen(codigo, extensiones[indice]);
		} else {
			imagen.onerror = null;
			imagen.src = "assets/img/montain.jfif";
		}
	};
}

// Muestra la información del producto activo en el detalle.
function mostrarProducto() {
	if (!productoActual) {
		document.querySelector(".main-container").innerHTML =
			"<p class=\"producto-no-encontrado\">Producto no encontrado.</p>";
		return;
	}

	document.title = `${productoActual.nombre} - Ferretería Los Maestros`;
	document.getElementById("bread-categoria").textContent = productoActual.categoria;
	document.getElementById("bread-categoria").href = "Producto.html";
	document.getElementById("bread-nombre").textContent = productoActual.nombre;
	document.getElementById("nombre-producto").textContent = productoActual.nombre;
	document.getElementById("precio-producto").textContent =
		formatoPrecio.format(productoActual.precioVenta);
	document.getElementById("descripcion-producto").textContent =
		`${productoActual.nombre}, marca ${productoActual.marca}. Presentación: ${productoActual.unidad}. ` +
		`Stock disponible: ${productoActual.stock} unidades.`;

	const imagenPrincipal = document.getElementById("img-principal");
	imagenPrincipal.alt = productoActual.nombre;
	configurarImagen(imagenPrincipal, productoActual.codigo);

	const selectorCantidad = document.getElementById("select-cantidad");
	const cantidadMaxima = Math.min(productoActual.stock, 10);
	selectorCantidad.innerHTML = "";

	for (let cantidad = 1; cantidad <= cantidadMaxima; cantidad += 1) {
		selectorCantidad.insertAdjacentHTML(
			"beforeend",
			`<option value="${cantidad}">${cantidad}</option>`
		);
	}

	if (productoActual.stock === 0) {
		selectorCantidad.disabled = true;
		document.getElementById("btn-anadir").disabled = true;
	}

	mostrarMiniatura();
	mostrarRelacionados();
}

// Genera la miniatura principal del producto y permite cambiar la imagen destacada.
function mostrarMiniatura() {
	const contenedor = document.getElementById("thumbnails-box");
	const miniatura = document.createElement("button");
	const imagen = document.createElement("img");

	miniatura.type = "button";
	miniatura.className = "miniatura activa";
	imagen.alt = `Miniatura de ${productoActual.nombre}`;
	configurarImagen(imagen, productoActual.codigo);
	miniatura.appendChild(imagen);
	contenedor.appendChild(miniatura);

	miniatura.addEventListener("click", () => {
		configurarImagen(document.getElementById("img-principal"), productoActual.codigo);
	});
}

// Muestra productos sugeridos según la misma categoría.
function mostrarRelacionados() {
	const contenedor = document.getElementById("relacionados-container");
	const relacionados = productos
		.filter(producto =>
			producto.categoria === productoActual.categoria &&
			producto.codigo !== productoActual.codigo
		)
		.slice(0, 5);

	contenedor.innerHTML = relacionados.map(producto => `
		<article class="producto-relacionado">
			<a href="DetalleProducto.html?codigo=${producto.codigo}">
				<img src="${rutaImagen(producto.codigo)}" alt="${producto.nombre}"
					data-codigo="${producto.codigo}"
					data-extension="jpg"
					onerror="cargarImagenAlternativa(this, 'https://via.placeholder.com/200x160?text=${producto.codigo}')">
				<h3>${producto.nombre}</h3>
				<p>${formatoPrecio.format(producto.precioVenta)}</p>
			</a>
		</article>
	`).join("");
}

// Añade el producto actual al carrito con la cantidad seleccionada.
function agregarProductoAlCarrito() {
	const cantidad = Number(document.getElementById("select-cantidad").value);
	const carrito = JSON.parse(localStorage.getItem("carrito_ferreteria")) || [];
	const productoEnCarrito = carrito.find(item => item.codigo === productoActual.codigo);

	if (productoEnCarrito) {
		if (productoEnCarrito.cantidad + cantidad > productoActual.stock) {
			alert("No hay suficiente stock disponible.");
			return;
		}

		productoEnCarrito.cantidad += cantidad;
	} else {
		carrito.push({
			codigo: productoActual.codigo,
			nombre: productoActual.nombre,
			precio: productoActual.precioVenta,
			unidad: productoActual.unidad,
			cantidad
		});
	}

	localStorage.setItem("carrito_ferreteria", JSON.stringify(carrito));
	actualizarBadgeCarrito();
	alert(`"${productoActual.nombre}" fue añadido al carrito.`);
}

document.addEventListener("DOMContentLoaded", () => {
	mostrarProducto();

	const boton = document.getElementById("btn-anadir");
	if (boton) {
		boton.addEventListener("click", agregarProductoAlCarrito);
	}
});
