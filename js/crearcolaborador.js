document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('.formulario');
    const nombreInput = document.getElementById('nombre');
    const numeroCelularInput = document.getElementById('numeroCelular');
    const rolInput = document.getElementById('rol');
    const emailInput = document.getElementById('email');
    const cedulaInput = document.getElementById('cedula');
    const contrasenaInput = document.getElementById('contrasena');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        if (nombreInput.value.trim() === '' || 
            numeroCelularInput.value.trim() === '' || 
            rolInput.value === '' || 
            email.value.trim() === '' || 
            cedulaInput.value.trim() === '' || 
            contrasenaInput.value.trim() === '') {
            
            alert('Por favor, completa todos los campos.');
            return;
        }

        const empleado = {
            nombre: nombreInput.value,
            numeroCelular: numeroCelularInput.value,
            rol: rolInput.value,
            email: emailInput.value,
            cedula: cedulaInput.value,
            contrasena: contrasenaInput.value
        };

        let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
        empleados.push(empleado);
        localStorage.setItem('empleados', JSON.stringify(empleados));

        alert('Empleado agregado exitosamente');
        formulario.reset();
    });
});