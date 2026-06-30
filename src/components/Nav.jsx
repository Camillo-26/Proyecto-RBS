import React from 'react';
// Renderiza de forma estática la barra de menú estructural, organizando mediante enlaces interactivos (a) y fuentes de iconos (Material Symbols) las diferentes categorías de platos del restaurante.
export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav_link">
        <a href="#"><span className="material-symbols-outlined">dinner_dining</span>Almuerzos</a>
        <a href="#"><span className="material-symbols-outlined">meal_dinner</span>Cenas</a>
        <a href="#"><span className="material-symbols-outlined">coffee</span>Desayunos</a>
        <a href="#"><span className="material-symbols-outlined">cake</span>Postres</a>
        <a href="#"><span className="material-symbols-outlined">kebab_dining</span>Entradas</a>
        <a href="#"><span className="material-symbols-outlined">wine_bar</span>Bebidas</a>
      </div>
    </nav>
  );
}