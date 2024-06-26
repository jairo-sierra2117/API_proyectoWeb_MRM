document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const selectedServiceType = localStorage.getItem('selectedServiceType'); // Obtener el tipo de servicio seleccionado

    if (date) {
        document.getElementById('date').value = date;
    }
    if (time) {
        document.getElementById('time').value = time;
    }

    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', function () {
        window.history.back();
    });

    const form = document.getElementById('appointment-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const appointment = {
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            phone: document.getElementById('phone').value,
            serviceType: selectedServiceType, // Guardar el tipo de servicio seleccionado
            model: document.getElementById('model').value,
            brand: document.getElementById('brand').value,
            placa: document.getElementById('placa').value,
            comments: document.getElementById('comments').value
        };

        // Guardar la cita en el localStorage
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Guardar el modelo de la moto en sessionStorage
        sessionStorage.setItem('clientData', JSON.stringify(appointment));

        window.location.href = '../Frotend/Citareservada.html';
    });
});
