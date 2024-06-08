document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el formulario y los elementos de entrada
    const formulario = document.querySelector('.formulario');
    const nombreInput = document.getElementById('nombre');
    const numeroCelularInput = document.getElementById('numeroCelular');
    const rolInput = document.getElementById('rol');
    const correoElectronicoInput = document.getElementById('correoElectronico');
    const cedulaInput = document.getElementById('cedula');
    const contrasenaInput = document.getElementById('contrasena');

    // Añade un evento de envío al formulario
    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        // Valida los campos del formulario
        if (nombreInput.value.trim() === '' || 
            numeroCelularInput.value.trim() === '' || 
            rolInput.value === '' || 
            correoElectronicoInput.value.trim() === '' || 
            cedulaInput.value.trim() === '' || 
            contrasenaInput.value.trim() === '') {
            
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Si todos los campos están llenos, realiza la acción deseada (puede ser enviar a un servidor o mostrar una alerta)
        alert('Empleado agregado exitosamente');

        // Limpia los campos del formulario
        formulario.reset();
    });
});
