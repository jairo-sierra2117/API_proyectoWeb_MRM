document.addEventListener("DOMContentLoaded", function() {
    const serviceOptions = document.querySelectorAll('.service-option');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            const serviceType = option.getAttribute('data-service-type');
            localStorage.setItem('selectedServiceType', serviceType);
            window.location.href = 'Averia.html'; // Redirige a la página de avería
        });
    });

    document.getElementById('book-appointment-btn').addEventListener('click', function() {
        const selectedDate = document.getElementById('date-input').value;
        const selectedTime = document.getElementById('time-input').value;
        const selectedServiceType = localStorage.getItem('selectedServiceType');
        
        if (selectedDate && selectedTime && selectedServiceType) {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            
            // Guardar la cita en localStorage
            const newAppointment = {
                date: selectedDate,
                time: selectedTime,
                phone: 'N/A',  // Puede ser reemplazado por un campo de entrada para el número de teléfono del cliente
                serviceType: selectedServiceType,
                comments: 'N/A'  // Puede ser reemplazado por un campo de entrada para comentarios adicionales
            };
            appointments.push(newAppointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            alert('Cita reservada con éxito');
            window.location.href = 'VerCitas.html';  // Redirigir a la página de ver citas
        } else {
            alert('Por favor selecciona una fecha, hora y tipo de servicio.');
        }
    });
});
