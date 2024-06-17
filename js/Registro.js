// En el archivo Registro.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registroForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const numero = document.getElementById('numero').value;
        const password = document.getElementById('password').value;

        if (!nombre || !email || !numero || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "nombre": nombre,
            "password": password,
            "username": email,
            "telefono": numero,
            "tipoUser": "CLIENTE" // Ajusta según tus necesidades, parece que este campo es fijo
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", requestOptions);

            if (!response.ok) {
                throw new Error('Error en el registro');
            }

            alert('¡Cuenta creada exitosamente!');

            // Redireccionar a la página de inicio de sesión
            window.location.href = '../Frotend/Login.html';

        } catch (error) {
            console.error('Error en el registro:', error.message);
            // No mostrar alerta aquí para evitar ventana emergente de error
        }
    });
});

function togglePassword() {
    var passwordField = document.getElementById("password");
    var passwordFieldType = passwordField.getAttribute("type");
    if (passwordFieldType === "password") {
        passwordField.setAttribute("type", "text");
    } else {
        passwordField.setAttribute("type", "password");
    }
}
