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
            document.getElementById('clientEmail').value = appointment.clientEmail;
            document.getElementById('clientPhone').value = appointment.phone;
            document.getElementById('serviceType').value = appointment.serviceType;
            document.getElementById('motoModel').value = appointment.model; // Agregar el modelo de la moto
            document.getElementById('observations').value = appointment.comments;
            document.getElementById('appointmentDateTime').value = `${appointment.date} ${appointment.time}`;
        });

        slotActions.appendChild(attendButton);
        appointmentSlot.appendChild(slotDetails);
        appointmentSlot.appendChild(slotActions);
        appointmentContainer.appendChild(appointmentSlot);
    });

    // Evento para el botón "Atender" en el modal
    const attendButtonModal = document.querySelector('.btn-attend-modal');
    attendButtonModal.addEventListener('click', function () {
        // Capturar los datos del cliente
        const clientName = document.getElementById('clientName').value;
        const clientLastName = document.getElementById('clientLastName').value;
        const clientEmail = document.getElementById('clientEmail').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const serviceType = document.getElementById('serviceType').value;
        const motoModel = document.getElementById('motoModel').value;
        const observations = document.getElementById('observations').value;

        // Almacenar en sessionStorage para pasar a la siguiente página
        const clientData = {
            clientName,
            clientLastName,
            clientEmail,
            clientPhone,
            serviceType,
            motoModel, // Agregar el modelo de la moto
            observations
        };
        sessionStorage.setItem('clientData', JSON.stringify(clientData));

        // Redirigir a la página de Checkingmecanico.html
        window.location.href = '../Frotend/Checkingmecanico.html';
    });
});
