document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos almacenados en localStorage
    const appointmentData = JSON.parse(localStorage.getItem('appointmentData'));

    // Mostrar datos en los campos correspondientes
    if (appointmentData) {
        document.getElementById('clientName').value = appointmentData.clientName || '';
        document.getElementById('clientLastName').value = appointmentData.clientLastName || '';
        document.getElementById('serviceType').value = appointmentData.serviceType || '';
        document.getElementById('assignedMechanic').value = appointmentData.assignedMechanic || '';
        document.getElementById('laborCost').value = appointmentData.laborCost || '';
        document.getElementById('totalCost').value = appointmentData.totalCost || '';
        document.getElementById('appointmentID').value = appointmentData.appointmentID || '';
    }
});