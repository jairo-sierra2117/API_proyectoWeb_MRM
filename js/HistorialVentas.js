// HistorialVentas.js

document.addEventListener('DOMContentLoaded', () => {
    const historialVentasBody = document.getElementById('historial-ventas-body');
    const modalsContainer = document.getElementById('modals-container');
  
    // Retrieve sales data from localStorage
    const salesData = JSON.parse(localStorage.getItem('salesData')) || [];
  
    salesData.forEach((sale, index) => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${sale.id}</td>
        <td>${sale.date}</td>
        <td>${index + 1}</td>
        <td>${sale.totalPrice}</td>
        <td><button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#detallesVentaModal${index}">Ver Detalles</button></td>
      `;
  
      historialVentasBody.appendChild(row);
  
      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.id = `detallesVentaModal${index}`;
      modal.tabIndex = -1;
      modal.setAttribute('aria-labelledby', `detallesVentaModalLabel${index}`);
      modal.setAttribute('aria-hidden', 'true');
      
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="detallesVentaModalLabel${index}">Venta No: ${index + 1}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5>Productos que se usaron</h5>
              <ul>
                ${sale.products.map(product => `<li>ID Producto: ${product.id}, Cantidad: ${product.quantity}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      `;
  
      modalsContainer.appendChild(modal);
    });
  });
  