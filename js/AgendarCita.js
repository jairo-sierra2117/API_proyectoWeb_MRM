document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    const time = urlParams.get('time');

    if (date) {
        document.getElementById('date').value = date;
    }
    if (time) {
        document.getElementById('time').value = time;
    }

    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', function() {
        window.history.back();
    });

    const form = document.getElementById('appointment-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const appointment = {
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            phone: document.getElementById('phone').value,
            comments: document.getElementById('comments').value
        };

        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        window.location.href = '../Frotend/Citareservada.html';
    });
});
