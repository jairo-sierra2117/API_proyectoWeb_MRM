
$(document).ready(function () {

    // Eliminar elementos seleccionados
    $('#deleteButton').click(function () {
        $('#inventoryTable tbody input[type="checkbox"]:checked').each(function () {
            let id = $(this).closest('tr').find('td:eq(1)').text(); // Obtener el ID del producto
            eliminarProducto(id); // Llamar a la función para eliminar el producto en el backend
            $(this).closest('tr').remove(); // Eliminar la fila de la tabla
        });
    });

    // Editar elementos
    $('#inventoryTable').on('click', '.editButton', function () {
        let id = $(this).closest('tr').find('td:eq(1)').text(); // Obtener el ID del producto
        cargarDatosEdicion(id); // Cargar datos del producto para edición
    });

    // Guardar cambios en la edición
    $('#saveChangesButton').click(function () {
        let id = $('#editId').val();
        let formData = {
            descripcion: $('#editName').val(),
            codigo: $('#editCode').val(),
            categoriaId: $('#editCategory').val(),
            stock: $('#editQuantity').val(),
            marcaId: $('#editSupplier').val(),
            precioCosto: $('#editCost').val(),
            precioVenta: $('#editSaleCost').val()
        };

        // Realizar solicitud PUT al backend para actualizar el producto
        editarProducto(id, formData);
    });

    // Mostrar modal de creación al hacer clic en Agregar
    $('#btnAgregar').click(function () {
        $('#createModal').modal('show');
    });

    // Enviar formulario de creación al backend
    $('#createProductButton').click(function () {
        let formData = {
            descripcion: $('#nombre').val(),
            codigo: $('#codigo').val(),
            categoriaId: parseInt($('#categoriaId').val()),
            marcaId: parseInt($('#marcaId').val()),
            stock: parseInt($('#stock').val()),
            precioCosto: parseFloat($('#precioCosto').val()),
            precioVenta: parseFloat($('#precioVenta').val())
        };

        // Realizar la solicitud POST al backend para crear un nuevo producto
        crearProducto(formData);
    });

    // Cargar datos del inventario desde la API al cargar la página
    cargarDatosInventario();

    // Función para cargar datos de un producto para edición
    function cargarDatosEdicion(id) {
        fetch(`http://localhost:8080/api/productos/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener datos del producto');
                }
                return response.json();
            })
            .then(data => {
                $('#editId').val(data.id);
                $('#editName').val(data.descripcion);
                $('#editCode').val(data.codigo);
                $('#editCategory').val(data.categoriaId);
                $('#editQuantity').val(data.stock);
                $('#editSupplier').val(data.marcaId);
                $('#editCost').val(data.precioCosto);
                $('#editSaleCost').val(data.precioVenta);
                $('#editModal').modal('show');
            })
            .catch(error => {
                console.error('Error al cargar datos para edición:', error);
            });
    }

    // Función para editar un producto por ID en el backend
    function editarProducto(id, formData) {
        fetch(`http://localhost:8080/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar el producto');
                }
                return response.json();
            })
            .then(data => {
                console.log('Producto editado exitosamente:', data);
                // Actualizar la fila en la tabla con los nuevos datos
                $('#inventoryTable tbody tr').each(function () {
                    if ($(this).find('td:eq(1)').text() === id) {
                        $(this).find('td:eq(3)').text(formData.descripcion);
                        $(this).find('td:eq(4)').text(formData.codigo);
                        $(this).find('td:eq(5)').text(formData.categoriaId);
                        $(this).find('td:eq(6)').text(formData.stock);
                        $(this).find('td:eq(7)').text(formData.marcaId);
                        $(this).find('td:eq(8)').text(formData.precioCosto);
                        $(this).find('td:eq(9)').text(formData.precioVenta);
                        return false; // Salir del bucle each
                    }
                });
                $('#editModal').modal('hide');
            })
            .catch(error => {
                console.error('Error al editar el producto:', error);
            });
    }

    // Función para crear un nuevo producto en el backend
    function crearProducto(formData) {
        fetch('http://localhost:8080/api/productos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear el producto');
                }
                return response.json();
            })
            .then(data => {
                console.log('Producto creado exitosamente:', data);
                // Agregar la nueva fila a la tabla
                const newRow = `
                <tr>
                    <td><input type="checkbox"></td>
                    <td>${data.id}</td>
                    <td>${data.index}</td>
                    <td>${data.descripcion}</td>
                    <td>${data.codigo}</td>
                    <td>${data.categoriaId}</td>
                    <td>${data.stock}</td>
                    <td>${data.marcaId}</td>
                    <td>${data.precioCosto}</td>
                    <td>${data.precioVenta}</td>
                    <td><button class="btn btn-warning btn-sm editButton">Edit</button></td>
                </tr>
            `;
                $('#inventoryTable tbody').append(newRow);
                $('#createModal').modal('hide'); // Ocultar modal después del envío
            })
            .catch(error => {
                console.error('Error al crear el producto:', error);
            });
    }

    // Función para eliminar un producto por ID en el backend
    function eliminarProducto(id) {
        fetch(`http://localhost:8080/api/productos/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }
                console.log('Producto eliminado exitosamente');
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    }

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

                // Limpiar cualquier contenido previo en el tbody
                tbody.empty();

                // Iterar sobre los datos y construir las filas de la tabla
                data.forEach((producto, index) => {
                    const row = `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${producto.id}</td>
                            <td>${index + 1}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.codigo}</td>
                            <td>${producto.categoriaId}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.marcaId}</td>
                            <td>${producto.precioCosto}</td>
                            <td>${producto.precioVenta}</td>
                            <td><button class="btn btn-warning btn-sm editButton">Edit</button></td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            })
            .catch(error => {
                console.error('Error al cargar datos del inventario:', error);
            });
    }
    function filterInventory() {
        const supplierFilter = $('#filterSupplier').val().toLowerCase();
        const categoryFilter = $('#filterCategory').val().toLowerCase();
        const costFilter = parseFloat($('#filterCost').val());
        const quantityFilter = parseInt($('#filterQuantity').val());

        $('#inventoryTable tbody tr').each(function () {
            const supplier = $(this).find('td:nth-child(8)').text().toLowerCase(); // Columna Proveedor
            const category = $(this).find('td:nth-child(6)').text().toLowerCase(); // Columna Categoría
            const cost = parseFloat($(this).find('td:nth-child(9)').text()); // Columna Costo adquirido
            const quantity = parseInt($(this).find('td:nth-child(7)').text()); // Columna Cantidad

            if (
                (supplierFilter === '' || supplier.includes(supplierFilter)) &&
                (categoryFilter === '' || category.includes(categoryFilter)) &&
                (isNaN(costFilter) || cost <= costFilter) &&
                (isNaN(quantityFilter) || quantity >= quantityFilter)
            ) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('#filterSupplier, #filterCategory, #filterCost, #filterQuantity').on('input', filterInventory);

    loadInventory();
});
