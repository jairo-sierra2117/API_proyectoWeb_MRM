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
                $('#edittipo').val(data.tipoId); // Aquí debe ser edittipo en lugar de tipoId
                $('#editCost').val(data.precioCosto);
                $('#editSaleCost').val(data.precioVenta);
                $('#editModal').modal('show');
            })
            .catch(error => {
                console.error('Error al cargar datos para edición:', error);
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
                            <td>${index + 1}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.codigo}</td>
                            <td>${producto.categoria}</td>
                            <td>${producto.tipo}</td>
                            <td>${producto.marca}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.precioCosto}</td>
                            <td>${producto.precioVenta}</td>
                        </tr>
                    `;
                    tbody.append(row);
                    // Verificar si el stock es menor a 5 unidades
                    if (producto.stock < 5) {
                        const stockBajoRow = `
                        <tr>
                            <td>${producto.descripcion}</td>
                            <td>${producto.stock}</td>
                        </tr>
                    `;
                        $('#stockBajoBody').append(stockBajoRow);
                    }
                });

                // Mostrar modal si hay productos con stock bajo
                if ($('#stockBajoBody tr').length > 0) {
                    $('#stockBajoModal').modal('show');
                }
                // Aplicar el filtro cuando cambien los valores de los inputs de filtro
                $('#filterSupplier, #filterCategory, #filterCost, #filterQuantity').on('input', function () {
                    aplicarFiltros();
                });

            })
            .catch(error => {
                console.error('Error al cargar datos del inventario:', error);
            });
    }

    // Función para aplicar los filtros al inventario
    function aplicarFiltros() {
        const filtroMarca = $('#filterSupplier').val().toLowerCase();
        const filtroCategoria = $('#filterCategory').val().toLowerCase();
        const filtroCosto = parseFloat($('#filterCost').val());
        const filtroCantidad = parseInt($('#filterQuantity').val());

        $('#inventoryTable tbody tr').each(function () {
            const marca = $(this).find('td:eq(5)').text().toLowerCase();
            const categoria = $(this).find('td:eq(3)').text().toLowerCase();
            const costo = parseFloat($(this).find('td:eq(8)').text()); // Índice correcto del costo venta
            const cantidad = parseInt($(this).find('td:eq(6)').text());

            const mostrar = (!filtroMarca || marca.includes(filtroMarca)) &&
                (!filtroCategoria || categoria.includes(filtroCategoria)) &&
                (!filtroCosto || costo >= filtroCosto) &&
                (!filtroCantidad || cantidad >= filtroCantidad);

            $(this).toggle(mostrar);
        });
    }


});
