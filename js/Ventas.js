$(document).ready(function () {
    // Función para cargar datos del inventario desde la API
    function cargarDatosInventario() {
        fetch('http://localhost:8080/api/productos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener datos del inventario');
                }
                return response.json();
            })
            .then(data => {
                const tbody = $('#inventoryTable tbody');
                const productosConBajaCantidad = [];

                // Limpiar cualquier contenido previo en el tbody
                tbody.empty();

                // Iterar sobre los datos y construir las filas de la tabla
                data.forEach((producto, index) => {
                    if (producto.stock < 5) {
                        productosConBajaCantidad.push(producto);
                    }
                    const row = `
                        <tr>
                            <td style="display: none;">${producto.id}</td>
                            <td>${index + 1}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.codigo}</td>
                            <td>${producto.categoria}</td>
                            <td>${producto.tipo}</td>
                            <td>${producto.marca}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.precioCosto}</td>
                            <td>${producto.precioVenta}</td>
                            <td><button class="btn btn-custom" onclick="addToSales('${producto.id}','${producto.codigo}', '${producto.descripcion}', ${producto.precioVenta})">+</button></td>
                        </tr>
                    `;
                    tbody.append(row);
                });

                // Mostrar alerta si hay productos con baja cantidad
                if (productosConBajaCantidad.length > 0) {
                    mostrarAlerta(productosConBajaCantidad);
                }
            })
            .catch(error => {
                console.error('Error al cargar datos del inventario:', error);
            });
    }

    // Eliminar elementos seleccionados
    $('#deleteButton').click(function () {
        $('#inventoryTable tbody input[type="checkbox"]:checked').each(function () {
            let id = $(this).closest('tr').find('td:eq(1)').text(); // Obtener el ID del producto
            eliminarProducto(id); // Llamar a la función para eliminar el producto en el backend
            $(this).closest('tr').remove(); // Eliminar la fila de la tabla
        });
    });

    // Llamar a la función para cargar los datos del inventario al cargar la página
    cargarDatosInventario();

    // Función para añadir productos a la tabla de ventas
    window.addToSales = function (id, codigo, descripcion, precio) {
        const tbodySales = $('#salesTable tbody');
        // Buscar si el producto ya está en la tabla de ventas
        const existingRow = tbodySales.find(`tr:has(td:first-child:contains(${id}))`);

        if (existingRow.length > 0) {
            // Si el producto ya está en la tabla, aumentar la cantidad
            const cantidadInput = existingRow.find('.cantidad-input');
            const cantidadActual = parseInt(cantidadInput.val());
            cantidadInput.val(cantidadActual + 1);
        } else {
            // Si no está en la tabla, agregar una nueva fila
            const newRow = `
            <tr>
                <td>${id}</td>
                <td>${codigo}</td>
                <td>${descripcion}</td>
                <td>${precio}</td>
                <td><input type="number" min="1" value="1" class="cantidad-input"></td>
                <td><button class="btn btn-custom removeButton">X</button></td>
            </tr>
        `;
            tbodySales.append(newRow);
        }
        actualizarTotalAPagar();
    };


    // Función para actualizar el total a pagar
    function actualizarTotalAPagar() {
        let total = 0;
        $('#salesTable tbody tr').each(function () {
            const precio = parseFloat($(this).find('td:eq(3)').text());
            const cantidad = parseInt($(this).find('.cantidad-input').val());
            total += precio * cantidad;
        });
        $('#totalPagar').text(total.toFixed(2));
    }

    // Evento para actualizar el total a pagar cuando cambia la cantidad
    $('#salesTable').on('input', '.cantidad-input', function () {
        actualizarTotalAPagar();
    });

    // Evento para eliminar una fila de la tabla de ventas
    $('#salesTable').on('click', '.removeButton', function () {
        $(this).closest('tr').remove();
        actualizarTotalAPagar();
    });

    // Evento para limpiar la tabla de ventas al hacer clic en el botón de cancelar
    $('#cancelButton').click(function () {
        $('#salesTable tbody').empty();
        actualizarTotalAPagar();
    });
    // Función para procesar la venta y enviar los datos al endpoint
    $('#completeSaleButton').click(function () {
        showSpinner();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const productosVenta = [];
        $('#salesTable tbody tr').each(function () {
            const productoId = $(this).find('td').eq(0).text(); // Aquí se asume que el productoId está en la primera columna
            const cantidad = $(this).find('.cantidad-input').val();
            productosVenta.push({
                productoId: parseInt(productoId, 10),
                cantidad: parseInt(cantidad, 10)
            });
        });
        const totalVenta = parseFloat($('#totalPagar').text());
        const raw = JSON.stringify({
            fecha: "2024-06-19",
            tipoVenta: "venta directa",
            clienteId: 123, // Cambia esto según sea necesario
            totalVenta: totalVenta,
            productosVenta: productosVenta
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:8080/api/ventas", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No se pudo completar la venta.');
                }
                hideSpinner();
                // Vaciar la tabla de ventas
                $('#salesTable tbody').empty();
                // Mostrar modal de venta exitosa
                $('#ventaModal').modal('show');
                cargarDatosInventario();
                return response.text();
            })
            .then((result) => {
                console.log(result);
                // Aquí puedes agregar lógica adicional si es necesario
            })
            .catch((error) => {
                console.error('Error:', error);
                // Mostrar mensaje de error en caso de no completarse la venta
                alert('No se pudo completar la venta. Por favor, inténtelo de nuevo.');
                hideSpinner();
            });
    });
//Esto lo agregue yo pa probar
    document.getElementById('completarVenta').addEventListener('click', function () {
        const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
      
        const newSale = {
          id: generateUniqueId(), // Implementa tu lógica para generar IDs únicos
          date: new Date().toLocaleString(),
          products: getProductsFromCurrentSale(), // Implementa tu lógica para obtener los productos de la venta actual
          totalPrice: calculateTotalPrice(), // Implementa tu lógica para calcular el precio total de la venta
        };
      
        salesData.push(newSale);
        localStorage.setItem('salesData', JSON.stringify(salesData));
      
        alert('Venta completada y registrada en el historial');
      });
      
      function generateUniqueId() {
        // Implementa tu lógica para generar IDs únicos
      }
      
      function getProductsFromCurrentSale() {
        // Implementa tu lógica para obtener los productos de la venta actual
        return [
          { id: '001', quantity: 2 },
          { id: '002', quantity: 1 },
        ];
      }
      
      function calculateTotalPrice() {
        // Implementa tu lógica para calcular el precio total de la venta
        return 100.0; // Ejemplo de precio total
      }

});