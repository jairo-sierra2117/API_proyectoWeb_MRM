// Archivo HistorialVentas.js

document.addEventListener('DOMContentLoaded', function() {
  // URL del endpoint de ventas
  var apiUrl = 'http://localhost:8080/api/ventas';

  // Obtener datos de la API usando fetch
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          // Limpiar tbody antes de agregar datos nuevos
          $('#historial-ventas-body').empty();

          // Iterar sobre cada venta en los datos recibidos
          data.forEach(function(venta) {
              // Crear una nueva fila de tabla para cada venta
              var row = $('<tr>');

              // Agregar cada columna de datos
              row.append($('<td>').text(venta.id));
              row.append($('<td>').text(venta.fecha));
              row.append($('<td>').text(venta.id)); // Ajustar según la estructura de datos
              row.append($('<td>').text(venta.totalVenta));

              // Botón para ver detalles con modal
              var detallesButton = $('<button>').text('Ver Detalles').addClass('btn btn-primary btn-sm')
                  .attr('data-toggle', 'modal').attr('data-target', '#modalVenta' + venta.id);
              var detallesColumn = $('<td>').append(detallesButton);
              row.append(detallesColumn);

              // Agregar la fila al tbody
              $('#historial-ventas-body').append(row);

              // Crear modal para detalles de venta
              var modal = createModal(venta);
              $('#modals-container').append(modal);
          });
      })
      .catch(error => {
          console.error('Error al obtener datos de la API:', error);
      });
});

// Función para crear el modal de detalles de venta
function createModal(venta) {
  var modalId = 'modalVenta' + venta.id;
  var modal = $('<div>').addClass('modal fade').attr('id', modalId)
      .attr('tabindex', '-1').attr('role', 'dialog').attr('aria-labelledby', modalId + 'Label')
      .attr('aria-hidden', 'true');
  var modalDialog = $('<div>').addClass('modal-dialog modal-dialog-centered').attr('role', 'document');
  var modalContent = $('<div>').addClass('modal-content');

  // Cabecera del modal
  var modalHeader = $('<div>').addClass('modal-header');
  modalHeader.append($('<h5>').addClass('modal-title').attr('id', modalId + 'Label').text('Detalles de Venta'));
  modalHeader.append($('<button>').addClass('close').attr('type', 'button').attr('data-dismiss', 'modal')
      .attr('aria-label', 'Close').append($('<span>').attr('aria-hidden', 'true').html('&times;')));
  modalContent.append(modalHeader);

  // Cuerpo del modal
  var modalBody = $('<div>').addClass('modal-body');
  modalBody.append($('<p>').text('ID de Venta: ' + venta.id));
  modalBody.append($('<p>').text('Fecha: ' + venta.fecha));
  modalBody.append($('<p>').text('Total Venta: ' + venta.totalVenta));

  // Tabla para productos vendidos
  var table = $('<table>').addClass('table table-bordered text-center');
  var thead = $('<thead>').append($('<tr>').append($('<th>').text('Producto ID')).append($('<th>').text('Cantidad')).append($('<th>').text('Nombre Del Producto')));
  var tbody = $('<tbody>');
  venta.productosVenta.forEach(function(producto) {
      var tr = $('<tr>');
      tr.append($('<td>').text(producto.productoId));
      tr.append($('<td>').text(producto.cantidad));
      tr.append($('<td>').text(producto.descripcion));
      tbody.append(tr);
  });
  table.append(thead).append(tbody);
  modalBody.append(table);
  modalContent.append(modalBody);

  // Footer del modal
  var modalFooter = $('<div>').addClass('modal-footer');
  modalFooter.append($('<button>').addClass('btn btn-secondary').attr('type', 'button').attr('data-dismiss', 'modal').text('Cerrar'));
  modalContent.append(modalFooter);

  // Agregar contenido al modal y retornarlo
  modalDialog.append(modalContent);
  modal.append(modalDialog);
  return modal;
}
