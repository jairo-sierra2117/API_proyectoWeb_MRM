// auth.js

document.addEventListener('DOMContentLoaded', function () {
    // Event listener para el formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();  // Evita que el formulario se envíe automáticamente

        const email = document.getElementById('email').value;  // Obtiene el valor del campo email
        const password = document.getElementById('password').value;  // Obtiene el valor del campo password

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": email,  // Utiliza el valor del campo email como username
            "password": password
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", requestOptions);

            if (!response.ok) {
                throw new Error('Error en el inicio de sesión');
            }

            const data = await response.json();
            console.log('Respuesta JSON de la API:', data);  // Muestra la respuesta en la consola

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);

                // Redirigir según el tipo de usuario correguir!
                if (data.dtype === 'Empleado') {
                    window.location.href = '../Frotend/BienvenidoAdm.html';  // Redirige a la vista de bienvenida del empleado
                } else if (data.dtype === 'Cliente') {
                    window.location.href = '../Frotend/BienvenidoCliente.html';  // Redirige a la vista de bienvenida del cliente
                } else {
                    console.error('Tipo de usuario desconocido:', data.dtype);
                }
            } else {
                throw new Error('Token de acceso no recibido');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.message);
            // Puedes mostrar un mensaje de error en la interfaz si lo deseas
            document.getElementById('loginMessage').innerText = 'Error en el inicio de sesión';
        }
    });

    // Función para alternar la visibilidad de la contraseña
    function togglePassword() {
        var passwordField = document.getElementById("password");
        var passwordFieldType = passwordField.getAttribute("type");
        if (passwordFieldType === "password") {
            passwordField.setAttribute("type", "text");
        } else {
            passwordField.setAttribute("type", "password");
        }
    }
});
