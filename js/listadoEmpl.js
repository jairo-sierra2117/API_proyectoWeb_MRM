$(document).ready(function () {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    // Realizar la solicitud de empleados una vez al cargar la página
    fetch("http://localhost:8080/api/user/empleados", requestOptions)
        .then(response => response.json())
        .then(data => {
            const employeesContainer = $('#employeesContainer');

            // Construir las cards de empleados
            data.forEach(empleado => {
                const card = `
                    <div class="col-md-4">
                        <div class="card mb-3">
                            <div class="card-header">${empleado.nombre}</div>
                            <div class="card-body">
                                <p><strong>Email:</strong> ${empleado.email}</p>
                                <p><strong>Teléfono:</strong> ${empleado.telefono}</p>
                                <p><strong>Rol:</strong> ${empleado.rol.length > 0 ? empleado.rol[0].roleNombre : 'Sin rol'}</p>
                                <div class="d-flex justify-content-between mt-3">
                                    <button class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal"
                                        data-name="${empleado.nombre}" data-role="${empleado.rol.length > 0 ? empleado.rol[0].roleNombre : ''}"
                                        data-celular="${empleado.telefono}" data-email="${empleado.email}" data-cedula="${empleado.cedula}"
                                        data-contraseña="">Editar</button>
                                    <a href="#" class="btn btn-danger">Deshabilitar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                employeesContainer.append(card);
            });

            // Rellenar el modal de edición al hacer clic en Editar
            $('#editModal').on('show.bs.modal', function (event) {
                const button = $(event.relatedTarget);
                const name = button.data('name');
                const role = button.data('role');
                const celular = button.data('celular');
                const email = button.data('email');
                const cedula = button.data('cedula');

                const modal = $(this);
                modal.find('#nombre').val(name);
                modal.find('#role').val(role);
                modal.find('#numeroCelular').val(celular);
                modal.find('#email').val(email);
                modal.find('#cedula').val(cedula);
                modal.find('#originalName').val(name);
            });

            // Enviar formulario de edición
            $('#editForm').submit(function (event) {
                event.preventDefault();
                const formData = $(this).serializeArray();
                const editedEmployee = {};
                formData.forEach(input => editedEmployee[input.name] = input.value);

                // Aquí puedes enviar la solicitud para guardar los cambios
                console.log('Empleado editado:', editedEmployee);

                // Cerrar modal
                $('#editModal').modal('hide');
            });

        })
        .catch(error => console.error("Error al obtener empleados:", error));
});