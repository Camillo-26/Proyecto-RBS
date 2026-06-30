import React from 'react';
// Renderiza el panel de cocina evaluando de forma condicional si hay comandas pendientes; si existen, genera dinámicamente un ticket estructurado por cada pedido mapeando los platos seleccionados y habilitando el botón 'LISTO' para despacharlo.
export default function ChefOrders({ pedidosChef, completarPedido }) {
  return (
    <section id="chef-section">
      <h2 className="section-title">Panel del Chef (Cocina)</h2>
      <div className="chef-orders" id="chef-orders">
        {pedidosChef.length === 0 ? (
          <p className="empty-msg">No hay pedidos pendientes...</p>
        ) : (
          pedidosChef.map((pedido) => (
            <div className="order-ticket" key={pedido.id}>
              <strong>Mesa #{pedido.mesa}</strong>
              <ul>
                {pedido.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button 
                onClick={() => completarPedido(pedido.id)} 
                style={{ fontSize: '0.7rem' }}
              >
                LISTO (Entregar)
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}