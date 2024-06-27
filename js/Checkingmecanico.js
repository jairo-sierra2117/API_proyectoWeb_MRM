document.addEventListener("DOMContentLoaded", function () {
    const currentAppointment = JSON.parse(sessionStorage.getItem('currentAppointment'));

    if (currentAppointment) {
        document.getElementById('motoModel').value = currentAppointment.model;
        document.getElementById('telefono').value = currentAppointment.phone;
        document.getElementById('descripcion').value = currentAppointment.description;
    }
});
