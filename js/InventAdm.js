$(document).ready(function () {

    // Cargar datos de marcas, categorías y tipos
    function cargarDatosSelectores() {
        fetch('http://localhost:8080/api/marcas')
            .then(response => response.json())
            .then(data => {
                const marcaSelect = $('#editSupplier, #marcaId');
                marcaSelect.empty();
                data.forEach(marca => {
                    const option = `<option value="${marca.id}">${marca.nombre}</option>`;
                    marcaSelect.append(option);
                });
            })
            .catch(error => console.error('Error al cargar marcas:', error));

        fetch('http://localhost:8080/api/categorias')
            .then(response => response.json())
            .then(data => {
                const categoriaSelect = $('#editCategory, #categoriaId');
                categoriaSelect.empty();
                data.forEach(categoria => {
                    const option = `<option value="${categoria.id}">${categoria.name}</option>`;
                    categoriaSelect.append(option);
                });
            })
            .catch(error => console.error('Error al cargar categorías:', error));

        fetch('http://localhost:8080/api/tipos')
            .then(response => response.json())
            .then(data => {
                const tipoSelect = $('#edittipo, #tipoId');
                tipoSelect.empty();
                data.forEach(tipo => {
                    const option = `<option value="${tipo.id}">${tipo.nombre}</option>`;
                    tipoSelect.append(option);
                });
            })
            .catch(error => console.error('Error al cargar tipos:', error));
    }

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
            categoriaId: parseInt($('#editCategory').val()), // Convertir a número
            stock: parseInt($('#editQuantity').val()), // Convertir a número
            marcaId: parseInt($('#editSupplier').val()), // Convertir a número
            tipoId: parseInt($('#edittipo').val()), // Convertir a número
            precioCosto: parseFloat($('#editCost').val()), // Convertir a número
            precioVenta: parseFloat($('#editSaleCost').val()) // Convertir a número
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
            categoriaId: parseInt($('#categoriaId').val()), // Convertir a número
            marcaId: parseInt($('#marcaId').val()), // Convertir a número
            stock: parseInt($('#stock').val()), // Convertir a número
            precioCosto: parseFloat($('#precioCosto').val()), // Convertir a número
            precioVenta: parseFloat($('#precioVenta').val()), // Convertir a número
            tipoId: parseInt($('#tipoId').val()) // Convertir a número
        };

        // Realizar la solicitud POST al backend para crear un nuevo producto
        crearProducto(formData);
    });

    // Cargar datos del inventario desde la API al cargar la página
    cargarDatosInventario();
    cargarDatosSelectores();

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
                $('#tipoId').val(data.tipoId); // Aquí debe ser tipoId en lugar de edittipo
                $('#editCost').val(data.precioCosto);
                $('#editSaleCost').val(data.precioVenta);
                $('#editModal').modal('show');
            })
            .catch(error => {
                console.error('Error al cargar datos para edición:', error);
            });
    }

    // Función para editar un producto por ID en el backend
// Función para editar un producto por ID en el backend
// Función para editar un producto por ID en el backend
function editarProducto(id, formData) {
    // Mostrar el JSON que se enviará antes de la solicitud
    console.log('JSON a enviar:', JSON.stringify(formData));

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
                    $(this).find('td:eq(8)').text(formData.tipoId);
                    $(this).find('td:eq(9)').text(formData.precioCosto);
                    $(this).find('td:eq(10)').text(formData.precioVenta);
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
                    <td>${data.tipoId}</td>
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
                            <td>${producto.categoria}</td>
                            <td>${producto.tipo}</td>
                            <td>${producto.marca}</td>
                            <td>${producto.stock}</td>
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

});
