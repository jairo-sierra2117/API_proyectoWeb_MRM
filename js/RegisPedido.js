document.addEventListener("DOMContentLoaded", function () {
    const agregarProductoBtn = document.getElementById("agregarProducto");
    const seleccionarProductoSelect = document.getElementById("seleccionarProducto");
    const productosTableBody = document.getElementById("productosTableBody");

    let totalPedido = 0;
    const totalPedidoElement = document.getElementById("totalPedido");

    agregarProductoBtn.addEventListener("click", function () {
        const productoSeleccionado = seleccionarProductoSelect.value;
        if (productoSeleccionado !== "Seleccionar producto") {
            const producto = JSON.parse(productoSeleccionado);
            agregarProductoATabla(producto);
        }
    });

    function agregarProductoATabla(producto) {
        const row = document.createElement("tr");

        const codigoCell = document.createElement("td");
        codigoCell.textContent = producto.codigo; // Usar el código real del producto
        row.appendChild(codigoCell);

        const nombreCell = document.createElement("td");
        nombreCell.textContent = producto.nombre || "Sin nombre"; // Usar el nombre real del producto o "Sin nombre" si está indefinido
        row.appendChild(nombreCell);

        const precioCell = document.createElement("td");
        precioCell.textContent = producto.precio.toLocaleString("es-CO", { style: "currency", currency: "COP" }).slice(0, -3); // Usar el precio real del producto
        row.appendChild(precioCell);

        const cantidadCell = document.createElement("td");
        const disminuirBtn = document.createElement("button");
        disminuirBtn.textContent = "-";
        disminuirBtn.className = "btn btn-outline-secondary btn-sm";
        disminuirBtn.addEventListener("click", function () {
            actualizarCantidad(row, -1);
        });
        cantidadCell.appendChild(disminuirBtn);

        const cantidadSpan = document.createElement("span");
        cantidadSpan.textContent = "1";
        cantidadSpan.className = "mx-2";
        cantidadCell.appendChild(cantidadSpan);

        const aumentarBtn = document.createElement("button");
        aumentarBtn.textContent = "+";
        aumentarBtn.className = "btn btn-outline-secondary btn-sm";
        aumentarBtn.addEventListener("click", function () {
            actualizarCantidad(row, 1);
        });
        cantidadCell.appendChild(aumentarBtn);

        row.appendChild(cantidadCell);

        const cancelarCell = document.createElement("td");
        const cancelarBtn = document.createElement("button");
        cancelarBtn.textContent = "✖";
        cancelarBtn.className = "btn btn-outline-danger btn-sm";
        cancelarBtn.addEventListener("click", function () {
            productosTableBody.removeChild(row);
            actualizarTotalPedido(-parseInt(precioCell.textContent.replace(/\./g, '')) * parseInt(cantidadSpan.textContent));
        });
        cancelarCell.appendChild(cancelarBtn);
        row.appendChild(cancelarCell);

        productosTableBody.appendChild(row);
        actualizarTotalPedido(parseInt(precioCell.textContent.replace(/\./g, '')));
    }

    function actualizarCantidad(row, cantidad) {
        const cantidadSpan = row.querySelector("span");
        const precioCell = row.querySelector("td:nth-child(3)");
        const nuevaCantidad = parseInt(cantidadSpan.textContent) + cantidad;
        if (nuevaCantidad > 0) {
            cantidadSpan.textContent = nuevaCantidad;
            actualizarTotalPedido(parseInt(precioCell.textContent.replace(/\./g, '')) * cantidad);
        }
    }

    function actualizarTotalPedido(cantidad) {
        totalPedido += cantidad;
        totalPedidoElement.textContent = totalPedido.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
        }).slice(0, -3);
    }

    function cargarProductos() {
        fetch('http://localhost:8080/api/productos')
            .then(response => response.json())
            .then(data => {
                seleccionarProductoSelect.innerHTML = '<option>Seleccionar producto</option>';
                data.forEach(producto => {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(producto); // Convertir el producto a cadena JSON
                    option.textContent = `${producto.nombre || "Sin nombre"} (${producto.codigo})`;
                    seleccionarProductoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al listar los productos:', error));
    }

    $('#registroPedidoModal').on('show.bs.modal', function () {
        cargarProductos();
    });
});
