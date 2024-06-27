document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem('idUser');
    const tableBody = document.querySelector('table tbody');

    if (userId) {
        fetch(`http://localhost:8080/api/citas`)
            .then(response => response.json())
            .then(data => {
                // Filtrar las citas por clienteId
                const userAppointments = data.filter(appointment => appointment.clienteId == userId);

                if (userAppointments.length > 0) {
                    userAppointments.forEach(appointment => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${appointment.fecha}</td>
                            <td>${appointment.hora}</td>
                            <td style="display: none;">${appointment.ncelular}</td>
                            <td>
                                <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#detailsModal"
                                onclick="showDetails('${appointment.fecha}', '${appointment.hora}', '${appointment.ncelular}', '${appointment.tipoServicio}', '${appointment.observacion}')">
                                Ver Detalles</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="4" class="text-center">No hay citas programadas.</td>
                    `;
                    tableBody.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4" class="text-center">Error al cargar las citas.</td>
                `;
                tableBody.appendChild(row);
            });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4" class="text-center">Usuario no encontrado.</td>
        `;
        tableBody.appendChild(row);
    }
});

function showDetails(date, time, phone, serviceType, comments) {
    document.getElementById('modal-date-time').innerText = `${date} ${time}`;
    document.getElementById('modal-client-phone').innerText = phone;
    document.getElementById('modal-service-type').innerText = serviceType || 'No especificado';
    document.getElementById('modal-comments').innerText = comments || 'Sin comentarios';
}

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
