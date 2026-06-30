import React from 'react';
// Renderiza la sección del catálogo iterando el array de platos mediante '.map()' para generar dinámicamente tarjetas HTML independientes, vinculando el botón de cada producto a la función externa 'agregarAlCarrito'.
export default function MenuGrid({ platos, agregarAlCarrito }) {
  return (
    <section id="menu-section">
      <h2 className="section-title">Nuestro Menú</h2>
      <div className="menu-grid" id="menu-grid">
        {platos.map((plato) => (
          <div className="card" key={plato.id}>
            <img src={plato.img} alt={plato.nombre} />
            <div className="card-content">
              <h3>{plato.nombre}</h3>
              <p>${plato.precio.toLocaleString()}</p>
              <button className="btn-add" onClick={() => agregarAlCarrito(plato.id)}>
                Añadir
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}