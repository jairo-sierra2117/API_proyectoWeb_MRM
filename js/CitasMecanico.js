document.addEventListener("DOMContentLoaded", function () {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointmentContainer = document.querySelector('.appointment-container');
    appointmentContainer.innerHTML = ''; // Limpiar contenido previo

    appointments.forEach((appointment, index) => {
        const appointmentSlot = document.createElement('div');
        appointmentSlot.className = 'appointment-slot';

        const slotDetails = document.createElement('div');
        slotDetails.className = 'slot-details';
        slotDetails.innerHTML = `<span>${appointment.time}</span><span>1 ESPACIO DISPONIBLE</span>`;

        const slotActions = document.createElement('div');
        slotActions.className = 'slot-actions';

        function marcarComoRealizado() {
            if (!appointment.isCompleted) {
                appointment.isCompleted = true;
                localStorage.setItem('appointments', JSON.stringify(appointments));

                const realizadoSpan = document.createElement('span');
                realizadoSpan.textContent = 'Realizado';
                realizadoSpan.className = 'realizado-text';
                realizadoSpan.style.marginLeft = '10px'; // Ajusta el margen izquierdo según necesites
                realizadoSpan.style.marginRight = '10px'; // Ajusta el margen derecho según necesites

                const existingRealizado = slotActions.querySelector('.realizado-text');
                if (!existingRealizado) {
                    slotActions.appendChild(verCitaButton);
                    slotActions.appendChild(realizadoSpan);
                }
            }
        }

        const verCitaButton = document.createElement('button');
        verCitaButton.className = 'btn btn-attend';
        verCitaButton.textContent = 'Ver Cita';
        verCitaButton.dataset.toggle = 'modal';
        verCitaButton.dataset.target = '#appointmentModal';
        verCitaButton.addEventListener('click', function () {
            document.getElementById('clientName').value = appointment.clientName;
            document.getElementById('clientLastName').value = appointment.clientLastName;
            document.getElementById('clientEmail').value = appointment.clientEmail;
            document.getElementById('clientPhone').value = appointment.phone;
            document.getElementById('serviceType').value = appointment.serviceType;
            document.getElementById('motoModel').value = appointment.model;
            document.getElementById('observations').value = appointment.comments;
            document.getElementById('appointmentDateTime').value = `${appointment.date} ${appointment.time}`;

            const attendButtonModal = document.querySelector('.btn-attend-modal');
            attendButtonModal.removeEventListener('click', attendButtonModal._markAsCompleted);
            attendButtonModal._markAsCompleted = function () {
                marcarComoRealizado();

                // Almacenar información en sessionStorage
                sessionStorage.setItem('currentAppointment', JSON.stringify({
                    model: appointment.model,
                    phone: appointment.phone,
                    description: appointment.comments
                }));

                window.location.href = '../Frotend/Checkingmecanico.html';
            };
            attendButtonModal.addEventListener('click', attendButtonModal._markAsCompleted);
        });

        if (appointment.isCompleted) {
            const realizadoSpan = document.createElement('span');
            realizadoSpan.textContent = 'Realizado';
            realizadoSpan.className = 'realizado-text';
            realizadoSpan.style.marginLeft = '10px'; // Ajusta el margen izquierdo según necesites
            realizadoSpan.style.marginRight = '10px'; // Ajusta el margen derecho según necesites
            
            slotActions.appendChild(verCitaButton);
            slotActions.appendChild(realizadoSpan);
        } else {
            slotActions.appendChild(verCitaButton);
        }

        appointmentSlot.appendChild(slotDetails);
        appointmentSlot.appendChild(slotActions);
        appointmentContainer.appendChild(appointmentSlot);
    });
});
