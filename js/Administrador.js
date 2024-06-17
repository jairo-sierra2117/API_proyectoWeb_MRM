document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Aquí puedes agregar la lógica para enviar los datos al servidor
        // Por ejemplo, usando fetch para una solicitud POST

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redireccionar a la página de bienvenida
                window.location.href = '../Frotend/BienvenidoAdm.html';
            } else {
                alert('Credenciales incorrectas, por favor intente de nuevo.');
            }
        })
        /*.catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al iniciar sesión. Por favor, intente de nuevo más tarde.');
        });*/
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
