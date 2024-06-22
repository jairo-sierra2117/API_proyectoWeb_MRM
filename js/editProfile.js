$(document).ready(function () {
    // Obtener información del usuario desde localStorage
    const userName = localStorage.getItem('nombre');
    const userEmail = localStorage.getItem('correo');
    const userPhone = localStorage.getItem('telefono');
    const userId = localStorage.getItem('idUser');  // Obtener el ID del usuario

    // Mostrar información actual en la página
    $('#userName').text(userName);
    $('#userEmail').text(userEmail);
    $('#userNameInput').val(userName);
    $('#userEmailInput').val(userEmail);
    $('#userPhoneInput').val(userPhone);

    // Mostrar el modal de edición al hacer clic en "Editar Perfil"
    $('[data-target="#editProfileModal"]').click(function () {
        $('#editUserName').val(userName);
        $('#editUserEmail').val(userEmail);
        $('#editUserPhone').val(userPhone);
        $('#editUserCedula').val(localStorage.getItem('cedula'));
    });

    // Enviar formulario de edición de perfil
    $('#editProfileForm').submit(function (event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        const editedProfile = {};
        formData.forEach(input => editedProfile[input.name] = input.value);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(editedProfile);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`http://localhost:8080/api/user/UpdateEmpleados/${userId}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar perfil');
                }
                return response.json();
            })
            .then(updatedProfile => {
                // Actualizar la información en la página
                $('#userName').text(updatedProfile.nombre);
                $('#userEmail').text(updatedProfile.email);
                $('#userNameInput').val(updatedProfile.nombre);
                $('#userEmailInput').val(updatedProfile.email);
                $('#userPhoneInput').val(updatedProfile.telefono);

                // Actualizar información en localStorage
                localStorage.setItem('nombre', updatedProfile.nombre);
                localStorage.setItem('correo', updatedProfile.email);
                localStorage.setItem('telefono', updatedProfile.telefono);

                // Mostrar alerta de éxito
                alert('Perfil actualizado correctamente');

                // Cerrar modal
                $('#editProfileModal').modal('hide');
            })
            .catch(error => {
                console.error('Error al actualizar perfil:', error);
                // Mostrar alerta de error si es necesario
                alert('Error al actualizar perfil');
            });
    });
});