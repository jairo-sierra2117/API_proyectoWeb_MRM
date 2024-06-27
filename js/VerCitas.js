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
// VerCitas.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cancel-appointment').addEventListener('click', () => {
        saveNotification('cita cancelada');
        alert('Cita cancelada');
    });

    document.getElementById('reschedule-appointment').addEventListener('click', () => {
        saveNotification('cita reprogramada');
        alert('Cita reprogramada');
    });

    document.getElementById('add-appointment').addEventListener('click', () => {
        saveNotification('Se ha agregado una nueva cita');
        alert('Nueva cita agregada');
    });
});

function saveNotification(message) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const newNotification = {
        message: message,
        date: new Date().toLocaleString()
    };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    const mecNotifications = JSON.parse(localStorage.getItem('mecNotifications')) || [];
    const auxNotifications = JSON.parse(localStorage.getItem('auxNotifications')) || [];

    mecNotifications.push(newNotification);
    auxNotifications.push(newNotification);

    localStorage.setItem('mecNotifications', JSON.stringify(mecNotifications));
    localStorage.setItem('auxNotifications', JSON.stringify(auxNotifications));
}
