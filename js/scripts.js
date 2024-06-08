document.addEventListener('DOMContentLoaded', function () {
    // Obtener todos los botones de editar
    const editButtons = document.querySelectorAll('.btn-primary[data-bs-toggle="modal"]');
    const deleteButtons = document.querySelectorAll('.btn-danger');
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const form = document.querySelector('#editModal form');

    editButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Obtener los datos del colaborador
            const card = event.target.closest('.card');
            const name = card.querySelector('.card-header').innerText;
            const role = card.querySelector('.card-body p').innerText.replace('Rol: ', '');
            
            // Llenar el formulario del modal con los datos del colaborador
            form.nombre.value = name;
            form.role.value = role;

            // Abre el modal
            modal.show();
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Aquí puedes añadir el código para enviar los datos del formulario al servidor
        console.log('Nombre:', form.nombre.value);
        console.log('Rol:', form.role.value);
        // Cerrar el modal
        modal.hide();
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            if (confirm('¿Estás seguro de que deseas eliminar este colaborador?')) {
                const card = event.target.closest('.card');
                card.remove();
            }
        });
    });
});
