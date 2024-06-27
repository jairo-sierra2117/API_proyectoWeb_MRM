document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const selectedServiceType = localStorage.getItem('selectedServiceType'); // Obtener el tipo de servicio seleccionado

    if (date) {
        document.getElementById('date').value = date;
    }
    if (time) {
        document.getElementById('time').value = time;
    }

    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', function () {
        window.history.back();
    });

    const form = document.getElementById('appointment-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const appointment = {
            fecha: document.getElementById('date').value,
            hora: document.getElementById('time').value,
            clienteId: localStorage.getItem('idUser'),// Debes obtener el ID del cliente desde el contexto de tu aplicación
            placaVehiculo: document.getElementById('placa').value,
            observacion: document.getElementById('comments').value,
            tipoServicio: selectedServiceType,
            modelo: document.getElementById('model').value,
            marca: document.getElementById('brand').value
        };




        fetch('http://localhost:8080/api/citas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Cita reservada con éxito');
                window.location.href = '../Frotend/Citareservada.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error al reservar la cita');
            });
    });
});
// AgendarCita.js
document.getElementById('appointment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const phone = document.getElementById('phone').value;

    // Simular envío de notificación
    const notifications = [
        'La cita se ha agendado correctamente.',
        `Se ha enviado la información al WhatsApp del número ${phone}.`
    ];

    notifications.forEach(notification => {
        showNotification(notification);
        saveNotification(notification);
    });
});

function showNotification(message) {
    const notificationsContainer = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'alert alert-success';
    notification.textContent = message;
    notificationsContainer.appendChild(notification);

    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function saveNotification(message) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const date = new Date().toLocaleString();
    notifications.push({ message, date });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}
document.getElementById('appointment-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const notificationMessage = "Se ha agregado una nueva cita";

    const notification = {
        message: notificationMessage,
        date: new Date().toLocaleString()
    };

    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    alert('Cita agendada correctamente.');

    // Opcionalmente, puedes redirigir a la página de notificaciones después de agendar la cita
    // window.location.href = '../Frotend/Notifimecanico.html';
});