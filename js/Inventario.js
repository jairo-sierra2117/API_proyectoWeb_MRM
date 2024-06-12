$(document).ready(function() {
    // Eliminar elementos seleccionados
    $('#deleteButton').click(function() {
        $('#inventoryTable tbody input[type="checkbox"]:checked').each(function() {
            $(this).closest('tr').remove();
        });
    });

    // Editar elementos
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
        row.find('td:eq(2)').text($('#editName').val());
        row.find('td:eq(3)').text($('#editCode').val());
        row.find('td:eq(4)').text($('#editDescription').val());
        row.find('td:eq(5)').text($('#editCategory').val());
        row.find('td:eq(6)').text($('#editQuantity').val());
        row.find('td:eq(7)').text($('#editSupplier').val());
        row.find('td:eq(8)').text($('#editCost').val());
        row.find('td:eq(9)').text($('#editSaleCost').val());
        $('#editModal').modal('hide');
    });

    // Seleccionar todos los checkboxes
    $('#selectAll').click(function() {
        $('#inventoryTable tbody input[type="checkbox"]').prop('checked', this.checked);
    });
});
