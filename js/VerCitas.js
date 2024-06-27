document.addEventListener("DOMContentLoaded", function() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const tableBody = document.querySelector('table tbody');

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${appointment.phone}</td>
            <td>
                <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#detailsModal" 
                onclick="showDetails('${appointment.date}', '${appointment.time}', 'N/A', '${appointment.phone}', '${appointment.serviceType}', '${appointment.comments}', this)">
                Ver Detalles</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
});

function showDetails(date, time, clientName, clientPhone, serviceType, comments, button) {
    document.getElementById('modal-date-time').innerText = `${date} ${time}`;
    document.getElementById('modal-client-name').innerText = clientName;
    document.getElementById('modal-client-phone').innerText = clientPhone;
    document.getElementById('modal-service-type').innerText = serviceType || 'No especificado';
    document.getElementById('modal-comments').innerText = comments || 'Sin comentarios';

    const cancelButton = document.getElementById('cancel-appointment');
    const rescheduleButton = document.getElementById('reschedule-appointment');

    cancelButton.onclick = function() {
        handleAppointment(button, date, time, false);
    };

    rescheduleButton.onclick = function() {
        handleAppointment(button, date, time, true);
    };
}

function handleAppointment(button, date, time, reschedule) {
    const row = button.closest('tr');
    const index = Array.from(row.parentNode.children).indexOf(row);
    row.remove();
    
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.splice(index, 1);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    localStorage.setItem('cancelledAppointment', JSON.stringify({ date, time }));

    $('#detailsModal').modal('hide');
    
    if (reschedule) {
        window.location.href = "../Frotend/Reservarcita.html";
    }
}
// Función para cancelar una cita
function cancelAppointment() {
    // Lógica para cancelar la cita

    // Guardar la notificación de cancelación
    const notification = {
        message: "cita cancelada",
        date: new Date().toLocaleDateString()
    };

    // Guardar la notificación en localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Evento click para el botón de Cancelar Cita
document.getElementById('cancel-appointment').addEventListener('click', cancelAppointment);
// Función para reprogramar una cita
function rescheduleAppointment() {
    // Lógica para reprogramar la cita

    // Guardar la notificación de reprogramación
    const notification = {
        message: "cita reprogramada",
        date: new Date().toLocaleDateString()
    };

    // Guardar la notificación en localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Evento click para el botón de Reprogramar Cita
document.getElementById('reschedule-appointment').addEventListener('click', rescheduleAppointment);
