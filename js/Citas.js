document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.querySelector('.calendar tbody');
    const timeSlots = document.getElementById('time-slots');
    const reserveBtn = document.getElementById('reserve-btn');
    const clearReservationsBtn = document.getElementById('clear-reservations-btn');
    const currentMonthYear = document.getElementById('current-month-year');

    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let reservedSlots = {};
    let currentReservation = null;

    function loadReservations() {
        const savedReservations = localStorage.getItem('reservedSlots');
        if (savedReservations) {
            reservedSlots = JSON.parse(savedReservations);
        }

        const savedCurrentReservation = localStorage.getItem('currentReservation');
        if (savedCurrentReservation) {
            currentReservation = JSON.parse(savedCurrentReservation);
        }
    }

    function saveReservations() {
        localStorage.setItem('reservedSlots', JSON.stringify(reservedSlots));
        localStorage.setItem('currentReservation', JSON.stringify(currentReservation));
    }

    function updateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        calendarBody.innerHTML = '';

        let day = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < (firstDay || 7) - 1) {
                    cell.classList.add('unavailable');
                } else if (day > daysInMonth) {
                    cell.classList.add('unavailable');
                } else {
                    cell.textContent = day;
                    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    // Deshabilitar días anteriores a hoy
                    const currentDate = new Date(currentYear, currentMonth, day);
                    if (currentDate < today) {
                        cell.classList.add('unavailable');
                    } else if (!reservedSlots[dateKey]) {
                        cell.classList.add('available');
                        cell.addEventListener('click', function() {
                            clearSelection();
                            cell.classList.add('selected');
                            generateTimeSlots(dateKey);
                        });
                    } else {
                        cell.classList.add('available');
                        cell.addEventListener('click', function() {
                            clearSelection();
                            cell.classList.add('selected');
                            generateTimeSlots(dateKey);
                        });
                    }
                    day++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    function clearSelection() {
        const selectedCells = document.querySelectorAll('.selected');
        selectedCells.forEach(cell => cell.classList.remove('selected'));
    }

    function generateTimeSlots(dateKey) {
        timeSlots.innerHTML = '';
        const hours = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];

        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.textContent = hour;
            if (!reservedSlots[dateKey] || !reservedSlots[dateKey].includes(hour)) {
                slot.classList.add('available');
                slot.addEventListener('click', function() {
                    clearTimeSlotSelection();
                    slot.classList.add('selected');
                    reserveBtn.disabled = false;
                    reserveBtn.dataset.date = dateKey;
                    reserveBtn.dataset.time = hour;
                });
            } else {
                slot.classList.add('unavailable');
            }
            timeSlots.appendChild(slot);
        });
    }

    function clearTimeSlotSelection() {
        const selectedSlots = document.querySelectorAll('#time-slots .selected');
        selectedSlots.forEach(slot => slot.classList.remove('selected'));
        reserveBtn.disabled = true;
    }

    reserveBtn.addEventListener('click', function() {
        const date = reserveBtn.dataset.date;
        const time = reserveBtn.dataset.time;

        if (currentReservation) {
            const { date: prevDate, time: prevTime } = currentReservation;
            const index = reservedSlots[prevDate].indexOf(prevTime);
            if (index !== -1) {
                reservedSlots[prevDate].splice(index, 1);
                if (reservedSlots[prevDate].length === 0) {
                    delete reservedSlots[prevDate];
                }
            }
        }

        if (!reservedSlots[date]) {
            reservedSlots[date] = [];
        }
        reservedSlots[date].push(time);

        currentReservation = { date, time };

        saveReservations();
        updateCalendar();
        clearTimeSlotSelection();
        timeSlots.innerHTML = '';
        // Redirigir a la página de formulario con la fecha y hora seleccionadas
        window.location.href = `Agendarcita.html?date=${date}&time=${time}`;
    });

    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    clearReservationsBtn.addEventListener('click', function() {
        reservedSlots = {};
        currentReservation = null;
        saveReservations();
        updateCalendar();
        alert('Todas las reservas han sido limpiadas.');
    });

    loadReservations();
    updateCalendar();
});

document.getElementById('book-appointment-btn').addEventListener('click', function() {
    const selectedDate = document.getElementById('date-input').value;
    const selectedTime = document.getElementById('time-input').value;
    
    if (selectedDate && selectedTime) {
        window.location.href = `Agendarcita.html?date=${selectedDate}&time=${selectedTime}`;
    } else {
        alert('Por favor selecciona una fecha y hora.');
    }
});
