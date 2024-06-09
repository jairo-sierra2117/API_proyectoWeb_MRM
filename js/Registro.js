document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registroForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const numero = document.getElementById('numero').value;
        const password = document.getElementById('password').value;

        if (!nombre || !email || !numero || !password) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Realizar alguna validación adicional si es necesario

        // Enviar los datos del formulario al servidor o realizar alguna acción
        alert('Formulario enviado con éxito.');

        // Redireccionar a la página de inicio de sesión
        window.location.href = '/Frotend/Login.html';
    });
});
