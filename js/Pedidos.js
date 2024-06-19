document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const codigo = document.getElementById('codigo').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value;
    const marca = document.getElementById('marca').value;
    const costoAdquirido = document.getElementById('costoAdquirido').value;
    const costoVenta = document.getElementById('costoVenta').value;
    const fecha = new Date().toLocaleString();

    // Crear objeto de pedido
    const pedido = {
        nombre,
        codigo,
        tipo,
        categoria,
        cantidad,
        marca,
        costoAdquirido,
        costoVenta,
        fecha
    };

    // Obtener pedidos existentes en localStorage
    let pedidos = localStorage.getItem('pedidos');
    if (pedidos) {
        pedidos = JSON.parse(pedidos);
    } else {
        pedidos = [];
    }

    // Añadir nuevo pedido
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Redirigir a la página de pedidos
    window.location.href = 'pedidos.html';
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener pedidos de localStorage
    let pedidos = localStorage.getItem('pedidos');
    if (pedidos) {
        pedidos = JSON.parse(pedidos);
        const pedidoTableBody = document.getElementById('pedidoTableBody');

        // Insertar pedidos en la tabla
        pedidos.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.nombre}</td>
                <td>${pedido.codigo}</td>
                <td>${pedido.tipo}</td>
                <td>${pedido.categoria}</td>
                <td>${pedido.cantidad}</td>
                <td>${pedido.marca}</td>
                <td>${pedido.costoAdquirido}</td>
                <td>${pedido.costoVenta}</td>
                <td>${pedido.fecha}</td>
            `;
            pedidoTableBody.appendChild(row);
        });
    }
});