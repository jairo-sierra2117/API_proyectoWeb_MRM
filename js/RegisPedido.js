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
