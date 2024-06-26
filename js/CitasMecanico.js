document.addEventListener("DOMContentLoaded", function () {
    const appointmentDate = document.getElementById('appointment-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    appointmentDate.textContent = `Citas disponibles el ${today.toLocaleDateString('es-ES', options)}`;


    // Obtener las citas almacenadas y mostrarlas
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointmentContainer = document.querySelector('.appointment-container');
    appointmentContainer.innerHTML = ''; // Limpiar contenido previo

    appointments.forEach(appointment => {
        const appointmentSlot = document.createElement('div');
        appointmentSlot.className = 'appointment-slot';
        
        const slotDetails = document.createElement('div');
        slotDetails.className = 'slot-details';
        slotDetails.innerHTML = `<span>${appointment.time}</span><span>1 ESPACIO DISPONIBLE</span>`;

        
        const slotActions = document.createElement('div');
        slotActions.className = 'slot-actions';
        const attendButton = document.createElement('button');
        attendButton.className = 'btn btn-attend';
        attendButton.dataset.toggle = 'modal';
        attendButton.dataset.target = '#appointmentModal';
        attendButton.textContent = 'Atender';
        attendButton.addEventListener('click', function () {
            document.getElementById('clientName').value = appointment.clientName;
            document.getElementById('clientLastName').value = appointment.clientLastName;
            document.getElementById('serviceType').value = appointment.serviceType;
            document.getElementById('assignedMechanic').value = appointment.assignedMechanic;
            document.getElementById('laborCost').value = appointment.laborCost;
            document.getElementById('totalCost').value = appointment.totalCost;
            document.getElementById('appointmentID').value = appointment.appointmentID;
        });

        slotActions.appendChild(attendButton);
        appointmentSlot.appendChild(slotDetails);
        appointmentSlot.appendChild(slotActions);
        appointmentContainer.appendChild(appointmentSlot);
    });

    // Evento para el botón "Guardar" en el modal
    const registrarPedidoButton = document.getElementById('registrarPedido');
    registrarPedidoButton.addEventListener('click', function () {
        // Capturar los datos ingresados por el usuario
        const clientName = document.getElementById('clientName').value;
        const clientLastName = document.getElementById('clientLastName').value;
        const serviceType = document.getElementById('serviceType').value;
        const assignedMechanic = document.getElementById('assignedMechanic').value;
        const laborCost = document.getElementById('laborCost').value;
        const totalCost = document.getElementById('totalCost').value;
        const appointmentID = document.getElementById('appointmentID').value;

        // Crear objeto con los datos de la cita
        const appointmentData = {
            clientName,
            clientLastName,
            serviceType,
            assignedMechanic,
            laborCost,
            totalCost,
            appointmentID
        };

        // Guardar los datos en localStorage
        localStorage.setItem('appointmentData', JSON.stringify(appointmentData));

        // Redirigir a HistorialServicio.html después de guardar los datos
        window.location.href = '../Frotend/HistorialServicio.html';
    });
});