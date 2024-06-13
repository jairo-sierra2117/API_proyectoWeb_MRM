document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.querySelector('table tbody');

    // Función para cargar los datos de los clientes
    function cargarClientes() {
        fetch('../api/clientes') // Aquí '/api/clientes' es un endpoint ficticio
            .then(response => response.json())
            .then(data => {
                tbody.innerHTML = ''; // Limpiar el tbody
                data.forEach(cliente => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cliente.nombre}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.numero}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al cargar los clientes. Por favor, intente de nuevo más tarde.');
            });
    }

    // Cargar los clientes al cargar la página
    cargarClientes();
});
