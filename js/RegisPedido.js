$(document).ready(function () {

    /************agregar proveedor al select***/
    const agregarProveedorBtn = document.getElementById("agregarProveedor");
    const nuevoProveedorInput = document.getElementById("nuevoProveedor");
    const nombreProveedorSelect = document.getElementById("nombreProveedor");

    agregarProveedorBtn.addEventListener("click", function () {
        const nuevoProveedor = nuevoProveedorInput.value.trim();
        if (nuevoProveedor) {
            const option = document.createElement("option");
            option.textContent = nuevoProveedor;
            nombreProveedorSelect.appendChild(option);
            nuevoProveedorInput.value = "";
        }
    });
    /**********************************************/

    // Función para cargar productos desde la API al modal de registro de pedido
    function cargarProductos() {
        fetch('http://localhost:8080/api/productos')
            .then(response => response.json())
            .then(data => {
                const seleccionarProductoSelect = document.getElementById('seleccionarProducto');
                seleccionarProductoSelect.innerHTML = '<option>Seleccionar producto</option>';
                data.forEach(producto => {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(producto); // Convertir el producto a cadena JSON
                    option.textContent = `${producto.descripcion} (${producto.codigo})`;
                    seleccionarProductoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al listar los productos:', error));
    }

    // Mostrar modal de registro de pedido y cargar productos y proveedores al abrirlo
    $('#registroPedidoModal').on('show.bs.modal', function () {
        cargarProductos();
        // cargarProveedores();
    });

    // Evento para agregar un nuevo proveedor
    $('#agregarProveedor').click(function () {
        const nuevoProveedor = $('#nuevoProveedor').val().trim();

        if (nuevoProveedor === '') {
            alert('Por favor, ingrese un nombre válido para el nuevo proveedor.');
            return;
        }

        // Aquí deberías hacer la solicitud POST para agregar el nuevo proveedor al backend
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoProveedor }), // JSON con el nombre del nuevo proveedor
        };

        fetch('http://localhost:8080/api/proveedores', requestOptions)
            .then(response => response.json())
            .then(data => {
                // Una vez agregado el proveedor, actualizas el select de proveedores y seleccionas el nuevo
                const nombreProveedorSelect = document.getElementById('nombreProveedor');
                const option = document.createElement("option");
                option.value = data.id; // Usar el ID devuelto por el backend si aplica
                option.textContent = data.nombre; // Nombre del proveedor
                nombreProveedorSelect.appendChild(option);
                nombreProveedorSelect.value = data.id; // Seleccionar el nuevo proveedor añadido
            })
            .catch(error => {
                console.error('Error al agregar el proveedor:', error);
                alert('Error al agregar el proveedor. Por favor, inténtelo de nuevo.');
            });
    });

    // Agregar producto seleccionado a la tabla de productos del pedido
    $('#agregarProducto').click(function () {
        const seleccionarProductoSelect = document.getElementById('seleccionarProducto');
        const selectedOption = seleccionarProductoSelect.options[seleccionarProductoSelect.selectedIndex].value;
        const producto = JSON.parse(selectedOption);

        if (!producto || producto.codigo === undefined) {
            alert('Por favor, seleccione un producto válido.');
            return;
        }

        const productosTableBody = document.getElementById('productosTableBody');
        let productoExistente = false;

        // Verificar si el producto ya está en la tabla y aumentar la cantidad
        $('#productosTableBody tr').each(function () {
            const codigo = $(this).find('td:eq(1)').text();
            if (codigo === producto.codigo) {
                const cantidadInput = $(this).find('.cantidad-input');
                let cantidad = parseInt(cantidadInput.val());
                cantidad++;
                cantidadInput.val(cantidad);
                productoExistente = true;
                return false; // Salir del bucle each una vez encontrado el producto
            }
        });

        // Si el producto no está en la tabla, agregar una nueva fila
        if (!productoExistente) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.codigo}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.precioCosto}</td>
                <td><input type="number" min="1" value="1" class="cantidad-input"></td>
                <td><button class="btn btn-danger btn-sm remove-producto">X</button></td>
            `;
            productosTableBody.appendChild(newRow);

            // Evento para eliminar una fila de la tabla de productos
            newRow.querySelector('.remove-producto').addEventListener('click', function () {
                newRow.remove();
                actualizarTotalPedido();
            });

            // Evento para actualizar el total del pedido cuando cambia la cantidad
            newRow.querySelector('.cantidad-input').addEventListener('input', function () {
                actualizarTotalPedido();
            });
        }

        actualizarTotalPedido();
    });

    // Función para actualizar el total del pedido
    function actualizarTotalPedido() {
        let total = 0;
        $('#productosTableBody tr').each(function () {
            const precio = parseFloat($(this).find('td:eq(3)').text());
            const cantidad = parseInt($(this).find('.cantidad-input').val());
            total += precio * cantidad;
        });
        $('#totalPedido').text(total.toFixed(2));
    }

    // Evento para registrar el pedido
    $('#registrarPedido').click(function () {
        // Obtener proveedor seleccionado
        const proveedorId = $('#nombreProveedor').val(); // Aquí obtienes el ID del proveedor seleccionado

        // Validar que se haya seleccionado un proveedor
        if (!proveedorId || proveedorId === 'Seleccione proveedor') {
            alert('Por favor, seleccione un proveedor.');
            return;
        }

        // Obtener datos de cada producto en la tabla
        const pedidoProductos = [];
        $('#productosTableBody tr').each(function () {
            const codigo = $(this).find('td:eq(0)').text();
            const cantidad = parseInt($(this).find('.cantidad-input').val());
            pedidoProductos.push({ productoId: codigo, cantidad: cantidad });
        });

        // Construir el objeto JSON para enviar al backend
        const pedidoData = {
            fechaIngreso: new Date().toISOString(), // Usar fecha actual
            proveedor: $('#nombreProveedor option:selected').text(), // Nombre del proveedor seleccionado
            costoPedido: parseFloat($('#totalPedido').text()),
            pedidoProductos: pedidoProductos
        };

        // Mostrar el JSON en la consola
        console.log('JSON a enviar:', JSON.stringify(pedidoData));

        // Enviar solicitud POST al endpoint para crear el pedido
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData),
        };

        fetch('http://localhost:8080/api/pedidos', requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log('Pedido creado exitosamente:', result);
                // Aquí puedes añadir lógica adicional después de crear el pedido
                // Por ejemplo, cerrar el modal, actualizar la interfaz, etc.
                $('#registroPedidoModal').modal('hide');
                // Limpiar tabla de productos después de registrar el pedido
                $('#productosTableBody').empty();
                // Reiniciar total del pedido
                $('#totalPedido').text('0.00');
            })
            .catch(error => {
                console.error('Error al crear el pedido:', error);
                alert('Error al crear el pedido. Por favor, inténtelo de nuevo.');
            });
    });

});

/* NO ELIMINAR ESTO  
    FUNCIONA 100% PERO FALTA ACOMODAR EL DTO PARA QUE EL JSON QUE DA TAMBIEN TRAIGA LOS DATOS 
            DE LOS PRUDUCTOS REGISTRADOS EN EL PEDIDO (fabian culero ._. ).
document.addEventListener("DOMContentLoaded", () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8080/api/pedidos", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById("pedidoTableBody");

            data.forEach((pedido) => {
                const row = document.createElement("tr");

                const fechaIngresoCell = document.createElement("td");
                fechaIngresoCell.textContent = pedido.fechaIngreso;
                row.appendChild(fechaIngresoCell);

                const proveedorCell = document.createElement("td");
                proveedorCell.textContent = pedido.proveedor;
                row.appendChild(proveedorCell);

                const costoPedidoCell = document.createElement("td");
                costoPedidoCell.textContent = pedido.costoPedido.toFixed(2);
                row.appendChild(costoPedidoCell);

                const productosCell = document.createElement("td");
                productosCell.innerHTML = pedido.pedidoProductos.map(producto => `ID: ${producto.productoId}, Cantidad: ${producto.cantidad}`).join('<br>');
                row.appendChild(productosCell);

                tableBody.appendChild(row);
            });
        })
        .catch((error) => console.error('Error:', error));
});*/

document.addEventListener("DOMContentLoaded", () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    let pedidosData = [];

    fetch("http://localhost:8080/api/pedidos", requestOptions)
        .then(response => response.json())
        .then(data => {
            pedidosData = data;
            renderTable(pedidosData);
        })
        .catch(error => console.error('Error:', error));

    const filterDate = document.getElementById("filterDate");
    const filterSupplier = document.getElementById("filterSupplier");
    const filterCost = document.getElementById("filterCost");

    filterDate.addEventListener("input", filterTable);
    filterSupplier.addEventListener("input", filterTable);
    filterCost.addEventListener("input", filterTable);

    function filterTable() {
        const dateValue = filterDate.value;
        const supplierValue = filterSupplier.value.toLowerCase();
        const costValue = filterCost.value;

        const filteredData = pedidosData.filter(pedido => {
            const dateMatch = dateValue ? pedido.fechaIngreso === dateValue : true;
            const supplierMatch = supplierValue ? pedido.proveedor.toLowerCase().includes(supplierValue) : true;
            const costMatch = costValue ? pedido.costoPedido <= parseFloat(costValue) : true;
            return dateMatch && supplierMatch && costMatch;
        });

        renderTable(filteredData);
    }

    function renderTable(data) {
        const tableBody = document.getElementById("pedidoTableBody");
        tableBody.innerHTML = "";

        data.forEach(pedido => {
            const row = document.createElement("tr");

            const fechaIngresoCell = document.createElement("td");
            fechaIngresoCell.textContent = pedido.fechaIngreso;
            row.appendChild(fechaIngresoCell);

            const proveedorCell = document.createElement("td");
            proveedorCell.textContent = pedido.proveedor;
            row.appendChild(proveedorCell);

            const costoPedidoCell = document.createElement("td");
            costoPedidoCell.textContent = pedido.costoPedido.toFixed(2);
            row.appendChild(costoPedidoCell);

            const productosCell = document.createElement("td");
            const productosInfo = `${pedido.pedidoProductos.length} productos`;
            const verDetallesButton = document.createElement("button");
            verDetallesButton.className = "btn btn-info";
            verDetallesButton.innerHTML = `${productosInfo} <i class="fa fa-eye"></i>`;
            verDetallesButton.onclick = () => mostrarDetalles(pedido.pedidoProductos);
            productosCell.appendChild(verDetallesButton);
            row.appendChild(productosCell);

            tableBody.appendChild(row);
        });
    }

    function mostrarDetalles(productos) {
        const detalleTableBody = document.getElementById("detalleProductoTableBody");
        detalleTableBody.innerHTML = "";

        productos.forEach(producto => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = producto.productoId;
            row.appendChild(idCell);

            // Asumiendo que tienes los detalles del producto en el objeto
            const codigoCell = document.createElement("td");
            codigoCell.textContent = producto.codigoProducto || "N/A"; // Placeholder si falta el dato
            row.appendChild(codigoCell);

            const nombreCell = document.createElement("td");
            nombreCell.textContent = producto.nombreProducto || "N/A"; // Placeholder si falta el dato
            row.appendChild(nombreCell);

            const costoCell = document.createElement("td");
            costoCell.textContent = producto.costoCompra?.toFixed(2) || "N/A"; // Placeholder si falta el dato
            row.appendChild(costoCell);

            const cantidadCell = document.createElement("td");
            cantidadCell.textContent = producto.cantidad;
            row.appendChild(cantidadCell);

            detalleTableBody.appendChild(row);
        });

        $('#detalleProductoModal').modal('show');
    }
});
