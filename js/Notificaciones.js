document.addEventListener('DOMContentLoaded', loadNotifications);

function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const tableBody = document.getElementById('notificationsTableBody');
    tableBody.innerHTML = '';

    // Filtrar y mostrar notificaciones relevantes
    const filteredNotifications = notifications.filter(notification =>
        notification.message === "Se ha agregado una nueva cita" ||
        notification.message === "cita cancelada" ||
        notification.message === "cita reprogramada"
    );

    filteredNotifications.forEach(notification => {
        const row = document.createElement('tr');
        const messageCell = document.createElement('td');
        const dateCell = document.createElement('td');

        messageCell.textContent = notification.message;
        dateCell.textContent = notification.date;

        row.appendChild(messageCell);
        row.appendChild(dateCell);
        tableBody.appendChild(row);
    });
}
