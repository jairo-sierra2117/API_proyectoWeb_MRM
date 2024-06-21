// Escuchar el evento de envío del formulario de cambio de contraseña
document.querySelector('#changePasswordModal form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Evitar el envío automático del formulario

    // Obtener los valores de las contraseñas del formulario
    const claveAct = document.getElementById('currentPassword').value;
    const nuevaClave = document.getElementById('newPassword').value;
    const confirmClave = document.getElementById('confirmPassword').value;

    // Validar que la nueva contraseña y la confirmación coinciden
    if (claveAct == nuevaClave) {
        alert("La nueva contraseña debe ser diferente a su actual contraseña");
        return;
    }
    // Validar que la nueva contraseña y la confirmación coinciden
    if (nuevaClave !== confirmClave) {
        alert("La nueva contraseña y la confirmación no coinciden");
        return;
    }

    // Obtener el email del usuario desde localStorage
    const email = localStorage.getItem('correo');
    const token = localStorage.getItem('accessToken');

    if (!token) {
        console.error('Token de autenticación no encontrado en localStorage');
        alert('Error de autenticación. Por favor, inicie sesión nuevamente.');
        return;
    }

    // Configurar los datos de la solicitud POST
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "actualPassword": claveAct,
            "newPassword": nuevaClave
        })
    };

    try {
        console.log('Enviando solicitud de cambio de contraseña a la API...');
        const response = await fetch("http://localhost:8080/api/user/reset-password", requestOptions);
        console.log('Respuesta de la API:', response);

        // Verificar si la respuesta es exitosa (código de estado HTTP 200-299)
        if (!response.ok) {
            console.error('Error en la respuesta de la API:', response.status, response.statusText);
            throw new Error('Error al cambiar la contraseña');
        }

        // Cerrar el modal y mostrar un mensaje de éxito
        $('#changePasswordModal').modal('hide');
        alert('Contraseña cambiada exitosamente');

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error.message);
        alert('Error al cambiar la contraseña: ' + error.message);
    }
});

function togglePassword(fieldId) {
    var passwordField = document.getElementById(fieldId);
    if (!passwordField) {
        console.error('Elemento con id ' + fieldId + ' no encontrado');
        return;
    }

    var passwordFieldType = passwordField.getAttribute("type");
    if (passwordFieldType === "password") {
        passwordField.setAttribute("type", "text");
    } else {
        passwordField.setAttribute("type", "password");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Obtener valores del localStorage
    const nombre = localStorage.getItem('nombre') || 'NOMBRE de usuario no encontrado';
    const email = localStorage.getItem('correo') || 'correo no encontrado';
    const cedula = localStorage.getItem('cedula') || 'cedula no encontrada';
    const telefono = localStorage.getItem('telefono') || 'telefono no encontrado';

    // Actualizar el contenido de los elementos en el DOM
    document.getElementById('userName').textContent = nombre;
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userNameInput').value = nombre;
    document.getElementById('userEmailInput').value = email;
    document.getElementById('userPhoneInput').value = telefono;
});
