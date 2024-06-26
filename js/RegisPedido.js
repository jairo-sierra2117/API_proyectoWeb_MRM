$(document).ready(function () {
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

    $('#registroPedidoModal').on('show.bs.modal', function () {
        cargarProductos();
    });

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
            const codigo = $(this).find('td:eq(0)').text();
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

    function actualizarTotalPedido() {
        let total = 0;
        $('#productosTableBody tr').each(function () {
            const precio = parseFloat($(this).find('td:eq(2)').text());
            const cantidad = parseInt($(this).find('.cantidad-input').val());
            total += precio * cantidad;
        });
        $('#totalPedido').text(total.toFixed(2));
    }
});
