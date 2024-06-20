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
                onclick="showDetails('${appointment.date}', '${appointment.time}', 'N/A', '${appointment.phone}', '${appointment.serviceType}', '${appointment.comments}')">
                Ver Detalles</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
});

function showDetails(date, time, clientName, clientPhone, serviceType, comments) {
    document.getElementById('modal-date-time').innerText = `${date} ${time}`;
    document.getElementById('modal-client-name').innerText = clientName;
    document.getElementById('modal-client-phone').innerText = clientPhone;
    document.getElementById('modal-service-type').innerText = serviceType;
    document.getElementById('modal-comments').innerText = comments;
}