// Escuchar el evento de envío del formulario de inicio de sesión
document.getElementById('loginFormClient').addEventListener('submit', async (e) => {
    e.preventDefault();  // Evitar el envío automático del formulario

    // Obtener los valores de email y contraseña del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    spinnerContainer.style.display = 'flex'; // Mostrar el spinner
    console.log('Iniciando sesión con:', email, password);

    // Configurar los datos de la solicitud POST
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": email,
            "password": password
        })
    };

    try {
        console.log('Enviando solicitud a la API...');
        const response = await fetch("http://localhost:8080/api/auth/login", requestOptions);
        console.log('Respuesta de la API:', response);

        // Verificar si la respuesta es exitosa (código de estado HTTP 200-299)
        if (!response.ok) {
            spinnerContainer.style.display = 'none'; // ocultar el spinner
            console.error('Error en la respuesta de la API:', response.status, response.statusText);
            throw new Error('Error en el inicio de sesión');
        }

        // Extraer los datos JSON de la respuesta
        const data = await response.json();
        console.log('Datos recibidos:', data);  // Mostrar datos recibidos en la consola

        // Verificar si se recibió un accessToken en la respuesta
        if (data.accessToken) {
            // Almacenar el token en localStorage
            localStorage.setItem('accessToken', data.tokenType + data.accessToken);
            console.log('Token almacenado en localStorage');

            // Guardar el idRole en localStorage
            const idRole = data.rol[0].idRole; // Suponiendo que siempre hay un único rol
            localStorage.setItem('idRole', idRole);
            console.log('ID de Rol almacenado en localStorage:', idRole);

            // Guardar información adicional del usuario en localStorage
            localStorage.setItem('idUser', data.idUser);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('correo', data.correo);
            localStorage.setItem('cedula', data.cedula);
            localStorage.setItem('telefono', data.telefono);
            console.log('Información adicional del usuario almacenada en localStorage');

            // Redirigir según el tipo de usuario y rol obtenidos
            if (data.userType === 'CLIENTE') {
                spinnerContainer.style.display = 'none'; // ocultar el spinner
                console.log('Redirigiendo a BienvenidoCliente.html...');
                window.location.href = '../Frotend/BienvenidoCliente.html';  // Redirigir a la página de cliente
            } else {
                spinnerContainer.style.display = 'none'; // ocultar el spinner
                console.warn('Tipo de usuario desconocido:', data.userType);
                document.getElementById('loginMessage').innerText = 'ESTE LOGIN ES VÁLIDO SOLO PARA CLIENTES';
                // Manejar el tipo de usuario desconocido según tu lógica
                // Por ejemplo:
                // window.location.href = '../Frontend/ErrorPage.html';
            }
        } else {
            console.error('Token no encontrado en la respuesta:', data);
            throw new Error('Token de acceso no recibido');
        }

    } catch (error) {
        spinnerContainer.style.display = 'none'; // ocultar el spinner
        console.error('Error en el inicio de sesión:', error.message);
        document.getElementById('loginMessage').innerText = error.message + '\nDATOS INVALIDOS\nINTENTE NUEVAMENTE';
    }
});
