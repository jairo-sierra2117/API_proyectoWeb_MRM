$(document).ready(function () {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    function fetchAndDisplayClients(filter = "") {
        fetch("http://localhost:8080/api/user/clientes", requestOptions)
            .then(response => response.json())
            .then(data => {
                const customersTableBody = $('#customersTableBody');
                customersTableBody.empty(); // Limpiar la tabla antes de agregar los datos

                // Filtrar los datos si hay un filtro
                const filteredData = filter
                    ? data.filter(cliente => cliente.telefono.startsWith(filter))
                    : data;

                // Construir las filas de la tabla de clientes
                filteredData.forEach(cliente => {
                    const row = `
                        <tr>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.email}</td>
                            <td>${cliente.telefono}</td>
                        </tr>
                    `;
                    customersTableBody.append(row);
                });
            })
            .catch(error => console.error("Error al obtener clientes:", error));
    }

    // Fetch all clients on page load
    fetchAndDisplayClients();

    // Add input event listener to the search input for real-time filtering
    $('#searchInput').on('input', function () {
        const filterValue = $(this).val();
        fetchAndDisplayClients(filterValue);
    });

    // Add keypress event listener to the search input to filter on Enter key press
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            const filterValue = $(this).val();
            fetchAndDisplayClients(filterValue);
        }
    });
});