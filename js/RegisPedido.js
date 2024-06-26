document.addEventListener("DOMContentLoaded", function () {
    const agregarProveedorBtn = document.getElementById("agregarProveedor");
    const nuevoProveedorInput = document.getElementById("nuevoProveedor");
    const nombreProveedorSelect = document.getElementById("nombreProveedor");

    const agregarProductoBtn = document.getElementById("agregarProducto");
    const seleccionarProductoSelect = document.getElementById("seleccionarProducto");
    const productosTableBody = document.getElementById("productosTableBody");

    let totalPedido = 0;
    const totalPedidoElement = document.getElementById("totalPedido");

    agregarProveedorBtn.addEventListener("click", function () {
        const nuevoProveedor = nuevoProveedorInput.value.trim();
        if (nuevoProveedor) {
            const option = document.createElement("option");
            option.textContent = nuevoProveedor;
            nombreProveedorSelect.appendChild(option);
            nuevoProveedorInput.value = "";
        }
    });

    agregarProductoBtn.addEventListener("click", function () {
        const productoSeleccionado = seleccionarProductoSelect.value;
        if (productoSeleccionado !== "Seleccionar producto") {
            agregarProductoATabla(productoSeleccionado);
        }
    });

    function agregarProductoATabla(producto) {
        const row = document.createElement("tr");

        const codigoCell = document.createElement("td");
        codigoCell.textContent = producto.codigo; // Usar el código real del producto
        row.appendChild(codigoCell);

        const nombreCell = document.createElement("td");
        nombreCell.textContent = producto.nombre; // Usar el nombre real del producto
        row.appendChild(nombreCell);

        const precioCell = document.createElement("td");
        precioCell.textContent = producto.costoVenta.toLocaleString("es-CO", { style: "currency", currency: "COP" }).slice(0, -3); // Usar el precio real del producto
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

    // Función para listar pedidos
    function listarPedidos() {
        fetch('http://localhost:8080/api/pedidos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los pedidos');
                }
                return response.json();
            })
            .then(data => {
                const pedidosList = document.getElementById("pedidosList");
                pedidosList.innerHTML = ''; // Limpiar la lista de pedidos

                data.forEach(pedido => {
                    const pedidoHtml = `
                        <div class="pedido">
                            <p>Fecha de Ingreso: ${pedido.fechaIngreso}</p>
                            <p>Proveedor: ${pedido.proveedor}</p>
                            <p>Costo Pedido: ${pedido.costoPedido}</p>
                            <p>Productos del Pedido:</p>
                            <ul>
                                ${pedido.pedidoProductos.map(producto => `<li>Producto ID: ${producto.productoId}, Cantidad: ${producto.cantidad}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    pedidosList.innerHTML += pedidoHtml;
                });
            })
            .catch(error => {
                console.error('Error al listar los pedidos:', error);
            });
    }

    // Función para crear un pedido
    function crearPedido() {
        const pedido = {
            fechaIngreso: new Date().toISOString(),
            proveedor: nombreProveedorSelect.value,
            costoPedido: totalPedido,
            pedidoProductos: Array.from(productosTableBody.querySelectorAll('tr')).map(row => ({
                productoId: parseInt(row.querySelector('td:nth-child(1)').textContent.replace('#', '')),
                cantidad: parseInt(row.querySelector('span').textContent)
            }))
        };

        fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear el pedido');
                }
                return response.json();
            })
            .then(data => {
                console.log('Pedido creado exitosamente:', data);
                listarPedidos(); // Actualizar la lista de pedidos
            })
            .catch(error => {
                console.error('Error al crear el pedido:', error);
            });
    }

    // Cargar los pedidos al cargar la página
    listarPedidos();

    // Crear un pedido al hacer clic en el botón de crear pedido
    const crearPedidoBtn = document.getElementById("registrarPedido");
    crearPedidoBtn.addEventListener("click", function () {
        crearPedido();
    });

    // Cargar productos en el select al abrir el modal
    $('#registroPedidoModal').on('show.bs.modal', function () {
        cargarProductos();
    });

    function cargarProductos() {
        fetch('http://localhost:8080/api/productos')
            .then(response => response.json())
            .then(data => {
                seleccionarProductoSelect.innerHTML = '<option>Seleccionar producto</option>';
                data.forEach(producto => {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(producto); // Convertir el producto a cadena JSON
                    option.textContent = `${producto.nombre} (${producto.codigo})`;
                    seleccionarProductoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al listar los productos:', error));
    }
});
