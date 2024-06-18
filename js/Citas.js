document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.querySelector('.calendar tbody');
    const timeSlots = document.getElementById('time-slots');
    const reserveBtn = document.getElementById('reserve-btn');
    const currentMonthYear = document.getElementById('current-month-year');

    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const reservedSlots = {};

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
                    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
                    if (!reservedSlots[dateKey]) {
                        cell.classList.add('available');
                        cell.addEventListener('click', function() {
                            clearSelection();
                            cell.classList.add('selected');
                            generateTimeSlots(day);
                        });
                    } else {
                        cell.classList.add('available');
                        cell.addEventListener('click', function() {
                            clearSelection();
                            cell.classList.add('selected');
                            generateTimeSlots(day);
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

    function generateTimeSlots(day) {
        timeSlots.innerHTML = '';
        const hours = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'];
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;

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

        if (!reservedSlots[date]) {
            reservedSlots[date] = [];
        }
        reservedSlots[date].push(time);

        updateCalendar();
        clearTimeSlotSelection();
        timeSlots.innerHTML = '';
        alert(`Cita reservada para el ${date} a las ${time}`);
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

    updateCalendar();
});
