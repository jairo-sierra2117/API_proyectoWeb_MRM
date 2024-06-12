document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.btn-primary[data-bs-toggle="modal"]');
    const deleteButtons = document.querySelectorAll('.btn-danger');
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const form = document.querySelector('#editForm');
    let currentCard = null;

    function cargarEmpleados() {
        const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
        const contenedor = document.querySelector('.container .row');
        contenedor.innerHTML = ''; // Limpiar el contenedor antes de cargar empleados

        empleados.forEach(empleado => {
            const card = document.createElement('div');
            card.classList.add('col-md-4');
            card.innerHTML = `
                <div class="card mb-3">
                    <div class="card-header">${empleado.nombre}</div>
                    <div class="card-body">
                        <p>Rol: ${empleado.rol}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" data-name="${empleado.nombre}" data-role="${empleado.rol}">Editar</button>
                            <a href="#" class="btn btn-danger">Eliminar</a>
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });

        // Asignar eventos de clic a los botones de editar y eliminar
        document.querySelectorAll('.btn-primary[data-bs-toggle="modal"]').forEach(button => {
            button.addEventListener('click', function (event) {
                currentCard = event.target.closest('.card');
                const name = event.target.getAttribute('data-name');
                const role = event.target.getAttribute('data-role');

                form.nombre.value = name;
                form.role.value = role;
                form.originalName.value = name;

                modal.show();
            });
        });

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', function (event) {
                if (confirm('¿Estás seguro de que deseas eliminar este colaborador?')) {
                    const card = event.target.closest('.card');
                    const nombreEmpleado = card.querySelector('.card-header').innerText;

                    // Eliminar la tarjeta del DOM
                    card.remove();

                    // Eliminar el empleado del almacenamiento local
                    let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
                    empleados = empleados.filter(emp => emp.nombre !== nombreEmpleado);
                    localStorage.setItem('empleados', JSON.stringify(empleados));

                    // Volver a cargar empleados para refrescar la vista
                    cargarEmpleados();
                }
            });
        });
    }

    // Cargar empleados almacenados al cargar la página
    cargarEmpleados();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = form.nombre.value;
        const role = form.role.value;

        currentCard.querySelector('.card-header').innerText = name;
        currentCard.querySelector('.card-body p').innerText = 'Rol: ' + role;

        let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
        empleados = empleados.map(emp => emp.nombre === form.originalName.value ? { ...emp, nombre: name, rol: role } : emp);
        localStorage.setItem('empleados', JSON.stringify(empleados));

        modal.hide();
    });
});
