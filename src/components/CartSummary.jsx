import React from 'react';
// Renderiza el componente del pie de página (footer) para calcular acumulativamente el total a pagar, mostrar el conteo actual de ítems y enlazar el botón de confirmación con la función 'enviarAlChef'.
export default function CartSummary({ carrito, enviarAlChef }) {
  // El cálculo se actualiza automáticamente cada vez que cambia el carrito
  const totalReal = carrito.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div id="cart-summary">
      <span>Items: <strong id="cart-count">{carrito.length}</strong></span>
      <span>Total: <strong id="cart-total">${totalReal.toLocaleString()}</strong></span>
      <button onClick={enviarAlChef} id="btn-enviar">ENVIAR PEDIDO AL CHEF</button>
    </div>
  );
}