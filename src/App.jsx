import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import MenuGrid from './components/MenuGrid';
import ChefOrders from './components/ChefOrders';
import CartSummary from './components/CartSummary';

// 1. Datos estáticos del menú (Tu array original)
const platos = [
  { id: 1, nombre: "Bandeja Paisa", precio: 35000, img: "https://www.infobae.com/new-resizer/j8Tn2FTf03GyboaZXdMHZtfrIjk=/arc-anglerfish-arc2-prod-infobae/public/7ZLBIEXDAFEUFB2MXROVEX2DHI.jpg" },
  { id: 2, nombre: "Ajiaco Santafereño", precio: 28000, img: "https://imagenes.elpais.com/resizer/v2/S42RJL45ZNJQDMZYUYP3WQWHW4.jpg?auth=6e8799a19db665a880829f251e8632dc110dabd6a85bc2021524f44cd0bf98cb&width=1960&height=1470&smart=true" },
  { id: 3, nombre: "Limonada Natural", precio: 7000, img: "https://cdnx.jumpseller.com/magnifique1/image/65465114/thumb/1079/1439?1752774094" }
];

export default function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  
  // Estado para la mesa (Carga inicial desde localStorage si existe)
  const [numeroMesa, setNumeroMesa] = useState(() => {
    return localStorage.getItem('mesaSeleccionada') || '01';
  });

  // Estado para controlar los productos agregados al carrito
  const [carrito, setCarrito] = useState([]);

  // Estado para la lista de comandas enviadas a la cocina (Chef)
  const [pedidosChef, setPedidosChef] = useState([]);


  // --- EFECTOS (Efectos secundarios) ---
  
  // Guarda automáticamente en localStorage cada vez que el número de mesa cambie
  useEffect(() => {
    localStorage.setItem('mesaSeleccionada', numeroMesa);
  }, [numeroMesa]);


  // --- LÓGICA / FUNCIONES ---

  // Añadir un plato al carrito presionando el botón de la tarjeta
  const agregarAlCarrito = (id) => {
    const plato = platos.find(p => p.id === id);
    if (plato) {
      setCarrito([...carrito, plato]);
    }
  };

  // Crear el ticket del pedido y enviarlo al panel de cocina
  const enviarAlChef = () => {
    if (carrito.length === 0) return alert("Selecciona algún plato primero");

    const nuevoPedido = {
      id: Date.now(), // ID único para usar como 'key' en React
      mesa: numeroMesa,
      items: carrito.map(item => item.nombre)
    };

    setPedidosChef([...pedidosChef, nuevoPedido]);
    setCarrito([]); // Limpia el carrito actual tras el envío
    alert("¡Pedido enviado a cocina!");
  };

  // Quitar el ticket de la cocina cuando el chef presiona "LISTO"
  const completarPedido = (id) => {
    setPedidosChef(pedidosChef.filter(pedido => pedido.id !== id));
  };

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <>
      {/* Pasamos los estados y funciones correspondientes a cada componente */}
      <Header numeroMesa={numeroMesa} setNumeroMesa={setNumeroMesa} />
      <Nav />
      
      <main className="container">
        <MenuGrid platos={platos} agregarAlCarrito={agregarAlCarrito} />
        <ChefOrders pedidosChef={pedidosChef} completarPedido={completarPedido} />
      </main>

      <CartSummary carrito={carrito} enviarAlChef={enviarAlChef} />
    </>
  );
}