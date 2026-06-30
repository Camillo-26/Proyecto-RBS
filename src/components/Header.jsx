import React from 'react';
// Define la función 'manejarCambioMesa' para solicitar al usuario un número de mesa por prompt, validar que sea un valor numérico entre 1 y 10, y actualizar el estado global con el número formateado a dos dígitos (ej: "01").
export default function Header({ numeroMesa, setNumeroMesa }) {
  const LIMITE_MAX = 10; 

  const manejarCambioMesa = () => {
    let nuevaMesa = prompt(`Ingrese el nuevo número de mesa (1-${LIMITE_MAX}):`, numeroMesa);

    if (nuevaMesa !== null && nuevaMesa !== "") {
      let numero = parseInt(nuevaMesa);

      if (!isNaN(numero) && numero >= 1 && numero <= LIMITE_MAX) {
        let mesaFormateada = numero.toString().padStart(2, '0');
        setNumeroMesa(mesaFormateada);
      } else {
        alert("Error: El número de mesa debe estar entre 1 y " + LIMITE_MAX + ".");
      }
    }
  };
// Renderiza la interfaz visual de la cabecera (header), mostrando dinámicamente el número de mesa actual y vinculando el botón de edición a la función 'manejarCambioMesa'.
  return (
    <header>
      <img src="/logo_proyecto.svg" alt="Logo Empresa" />
      <h1>EL BUEN SABOR</h1>
      <p className="mesa_info">
        Tradición en su mesa - {' '}
        <span id="numero_mesa">
          <strong>Mesa #{numeroMesa}</strong>
        </span>
        <button id="boton_cambiar_mesa" className="boton_mesa" onClick={manejarCambioMesa}>
          ✎
        </button>
      </p>
    </header>
  );
}