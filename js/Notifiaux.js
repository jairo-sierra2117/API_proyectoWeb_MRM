// Función para cargar las notificaciones desde localStorage y mostrarlas en la tabla
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const tableBody = document.getElementById('notificationsTableBody');
    tableBody.innerHTML = '';

    notifications.forEach(notification => {
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

// Llama a la función loadNotifications cuando la página se carga
document.addEventListener('DOMContentLoaded', loadNotifications);
// Función para cargar las notificaciones desde localStorage y mostrarlas en la tabla
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const tableBody = document.getElementById('notificationsTableBody');
    tableBody.innerHTML = '';

    // Filtrar las notificaciones con el mensaje "cita cancelada"
    const filteredNotifications = notifications.filter(notification => notification.message === "cita cancelada");

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

// Llama a la función loadNotifications cuando la página se carga
document.addEventListener('DOMContentLoaded', loadNotifications);
// Función para cargar las notificaciones desde localStorage y mostrarlas en la tabla
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const tableBody = document.getElementById('notificationsTableBody');
    tableBody.innerHTML = '';

    // Filtrar las notificaciones con el mensaje "cita reprogramada"
    const filteredNotifications = notifications.filter(notification => notification.message === "cita reprogramada");

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

// Llama a la función loadNotifications cuando la página se carga
document.addEventListener('DOMContentLoaded', loadNotifications);
