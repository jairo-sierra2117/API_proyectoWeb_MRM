$(document).ready(function() {
    function loadInventory() {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        $('#inventoryTable tbody').empty();
        $('#historicalTable tbody').empty(); // Limpiar la tabla de histórico
        inventory.forEach((item, index) => {
            let row = `<tr>
                            <td><input type="checkbox"></td>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.code}</td>
                            <td>${item.description}</td>
                            <td>${item.category}</td>
                            <td>${item.quantity}</td>
                            <td>${item.supplier}</td>
                            <td>${item.cost}</td>
                            <td>${item.saleCost}</td>
                            <td><button class="btn btn-warning btn-sm editButton">Edit</button></td>
                       </tr>`;
            $('#inventoryTable tbody').append(row);

            let historyRow = `<tr>
                                <td>${item.name}</td>
                                <td>${item.code}</td>
                                <td>Operación</td> <!-- Se puede especificar si es "Agregar", "Editar" o "Eliminar" -->
                                <td>${item.category}</td>
                                <td>${item.quantity}</td>
                                <td>${item.supplier}</td>
                                <td>${item.cost}</td>
                                <td>${item.saleCost}</td>
                                <td>${new Date().toLocaleString()}</td>
                              </tr>`;
            $('#historicalTable tbody').append(historyRow);
        });
    }

    function saveInventory(inventory) {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function getInventory() {
        return JSON.parse(localStorage.getItem('inventory')) || [];
    }

    $('#deleteButton').click(function() {
        let inventory = getInventory();
        $('#inventoryTable tbody input[type="checkbox"]:checked').each(function() {
            const rowIndex = $(this).closest('tr').index();
            inventory.splice(rowIndex, 1);
            $(this).closest('tr').remove();
        });
        saveInventory(inventory);
        loadInventory();
    });

    let row;
    $('#inventoryTable').on('click', '.editButton', function() {
        row = $(this).closest('tr');
        $('#editName').val(row.find('td:eq(2)').text());
        $('#editCode').val(row.find('td:eq(3)').text());
        $('#editDescription').val(row.find('td:eq(4)').text());
        $('#editCategory').val(row.find('td:eq(5)').text());
        $('#editQuantity').val(row.find('td:eq(6)').text());
        $('#editSupplier').val(row.find('td:eq(7)').text());
        $('#editCost').val(row.find('td:eq(8)').text());
        $('#editSaleCost').val(row.find('td:eq(9)').text());
        $('#editModal').modal('show');
    });

    $('#saveChangesButton').click(function() {
        let inventory = getInventory();
        const rowIndex = row.index();
        inventory[rowIndex] = {
            name: $('#editName').val(),
            code: $('#editCode').val(),
            description: $('#editDescription').val(),
            category: $('#editCategory').val(),
            quantity: $('#editQuantity').val(),
            supplier: $('#editSupplier').val(),
            cost: $('#editCost').val(),
            saleCost: $('#editSaleCost').val()
        };
        saveInventory(inventory);
        loadInventory();
        $('#editModal').modal('hide');
    });

    $('#selectAll').click(function() {
        $('#inventoryTable tbody input[type="checkbox"]').prop('checked', this.checked);
    });

    $('#addButton').click(function() {
        $('#addForm')[0].reset();
        $('#addModal').modal('show');
    });

    $('#saveAddButton').click(function() {
        let inventory = getInventory();
        const newItem = {
            name: $('#addName').val(),
            code: $('#addCode').val(),
            description: $('#addDescription').val(),
            category: $('#addCategory').val(),
            quantity: $('#addQuantity').val(),
            supplier: $('#addSupplier').val(),
            cost: $('#addCost').val(),
            saleCost: $('#addSaleCost').val()
        };
        inventory.push(newItem);
        saveInventory(inventory);
        loadInventory();
        $('#addModal').modal('hide');
    });

    function filterInventory() {
        const supplierFilter = $('#filterSupplier').val().toLowerCase();
        const categoryFilter = $('#filterCategory').val().toLowerCase();
        const costFilter = parseFloat($('#filterCost').val());
        const quantityFilter = parseInt($('#filterQuantity').val());

        const inventory = getInventory();
        const filteredInventory = inventory.filter(item => {
            return (
                (supplierFilter === '' || item.supplier.toLowerCase().includes(supplierFilter)) &&
                (categoryFilter === '' || item.category.toLowerCase().includes(categoryFilter)) &&
                (isNaN(costFilter) || item.cost <= costFilter) &&
                (isNaN(quantityFilter) || item.quantity >= quantityFilter)
            );
        });

        $('#inventoryTable tbody').empty();
        filteredInventory.forEach((item, index) => {
            let row = `<tr>
                            <td><input type="checkbox"></td>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.code}</td>
                            <td>${item.description}</td>
                            <td>${item.category}</td>
                            <td>${item.quantity}</td>
                            <td>${item.supplier}</td>
                            <td>${item.cost}</td>
                            <td>${item.saleCost}</td>
                            <td><button class="btn btn-warning btn-sm editButton">Edit</button></td>
                       </tr>`;
            $('#inventoryTable tbody').append(row);
        });
    }

    $('#filterSupplier, #filterCategory, #filterCost, #filterQuantity').on('input', filterInventory);

    loadInventory();
});
