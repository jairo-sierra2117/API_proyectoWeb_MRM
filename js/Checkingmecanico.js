document.addEventListener("DOMContentLoaded", function () {
    // Obtener los datos del cliente del sessionStorage
    const clientData = JSON.parse(sessionStorage.getItem('clientData'));

    if (clientData) {
        // Asignar los datos a los campos correspondientes
        document.getElementById('motoModel').value = clientData.motoModel || '';
        document.getElementById('nombre').value = `${clientData.clientName || ''} ${clientData.clientLastName || ''}`;
        document.getElementById('telefono').value = clientData.clientPhone || '';
        document.getElementById('descripcion').value = clientData.observations || '';
    }
});
