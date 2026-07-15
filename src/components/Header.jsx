import React, { useState, useEffect } from 'react';

export default function Header({ numeroMesa, setNumeroMesa }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState('login'); 
  const [inputMesa, setInputMesa] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const LIMITE_MAX = 10;
  const API_URL = 'http://localhost:5000/mesas'; 

  // --- CONTROL DE CIERRE DE PESTAÑA o REFRESCAR ---
  useEffect(() => {
    const liberarMesaAlCerrar = async () => {
      if (numeroMesa && numeroMesa !== "00") {
        try {
          const respuesta = await fetch(API_URL);
          const mesasEncontradas = await respuesta.json();
          const mesa = mesasEncontradas.find(m => m.numero === numeroMesa);
          
          if (mesa) {
            await fetch(`${API_URL}/${mesa.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ activa: false })
            });
          }
        } catch (error) {
          console.error("Error al liberar la mesa al cerrar:", error);
        }
      }
    };

    window.addEventListener('beforeunload', liberarMesaAlCerrar);
    return () => {
      window.removeEventListener('beforeunload', liberarMesaAlCerrar);
    };
  }, [numeroMesa]);

  // --- LÓGICA DE REGISTRO ---
  const manejarRegistro = async (e) => {
    e.preventDefault();
    const numero = parseInt(inputMesa);

    if (isNaN(numero) || numero < 1 || numero > LIMITE_MAX) {
      alert(`Error: El número de mesa debe estar entre 1 y ${LIMITE_MAX}.`);
      return;
    }

    if (!inputPassword) {
      alert("Por favor, ingrese una contraseña.");
      return;
    }

    const numeroMesaStr = numero.toString().padStart(2, '0');

    try {
      const respuestaVerificacion = await fetch(API_URL);
      const mesasEncontradas = await respuestaVerificacion.json();
      const mesaExiste = mesasEncontradas.some(m => m.numero === numeroMesaStr);
      
      if (mesaExiste) {
        alert(`La Mesa #${numeroMesaStr} ya se encuentra registrada. Inicia sesión.`);
        setPestañaActiva('login');
        return;
      }

      const nuevoRegistro = {
        numero: numeroMesaStr, 
        password: inputPassword,
        activa: false 
      };

      const respuestaRegistro = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRegistro)
      });

      if (respuestaRegistro.ok) {
        alert(`¡Mesa #${numeroMesaStr} registrada con éxito! Ya puedes iniciar sesión.`);
        setPestañaActiva('login');
        setInputPassword('');
        setInputMesa('');
      } else {
        alert("Error: El servidor rechazó guardar la mesa.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error: No se pudo conectar con el servidor.");
    }
  };

  // --- LÓGICA DE INICIO DE SESIÓN ---
  const manejarLogin = async (e) => {
    e.preventDefault();
    const numero = parseInt(inputMesa);
    
    if (isNaN(numero)) {
      alert("Número de mesa no válido.");
      return;
    }

    const numeroMesaStr = numero.toString().padStart(2, '0');

    try {
      const respuesta = await fetch(API_URL);
      const mesasDb = await respuesta.json();
      const mesaDb = mesasDb.find(m => m.numero === numeroMesaStr);

      if (!mesaDb) {
        alert("Error: Esta mesa no está registrada. Por favor regístrala primero.");
        return;
      }

      if (mesaDb.password !== inputPassword) {
        alert("Error: Contraseña incorrecta.");
        return;
      }

      if (mesaDb.activa === true) {
        alert(`Acceso denegado: La Mesa #${numeroMesaStr} ya está activa en otra pestaña.`);
        return;
      }

      const respuestaPatch = await fetch(`${API_URL}/${mesaDb.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: true })
      });

      if (respuestaPatch.ok) {
        setNumeroMesa(numeroMesaStr);
        alert(`Sesión iniciada con éxito en la Mesa #${numeroMesaStr}`);
        cerrarModal();
      } else {
        alert("Error al intentar activar la mesa en el servidor.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  // --- LÓGICA DE CIERRE DE SESIÓN ---
  const manejarCerrarSesion = async () => {
    if (window.confirm("¿Seguro que deseas salir y liberar esta mesa?")) {
      try {
        const respuesta = await fetch(API_URL);
        const mesasDb = await respuesta.json();
        const mesaDb = mesasDb.find(m => m.numero === numeroMesa);

        if (mesaDb) {
          await fetch(`${API_URL}/${mesaDb.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activa: false })
          });
        }
        setNumeroMesa("00");
      } catch (error) {
        console.error("Error al liberar la mesa:", error);
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setInputMesa('');
    setInputPassword('');
  };

  return (
    <>
      <header>
        <img src="/logo_proyecto.svg" alt="Logo Empresa" />
        <h1>EL BUEN SABOR</h1>
        <p className="mesa_info">
          Tradición en su mesa - {' '}
          <span id="numero_mesa">
            <strong>Mesa #{numeroMesa}</strong>
          </span>
          {numeroMesa !== "00" ? (
            /* BOTÓN MODIFICADO: Solo muestra un icono de salida de forma limpia */
            <button 
              id="boton_cambiar_mesa" 
              className="boton_mesa" 
              onClick={manejarCerrarSesion} 
              title="Cerrar Sesión"
              style={styles.botonLogoutIcono}
            >
              🚪
            </button>
          ) : (
            <button id="boton_cambiar_mesa" className="boton_mesa" onClick={() => setMostrarModal(true)} title="Iniciar/Registrar">
              ✎
            </button>
          )}
        </p>
      </header>

      {mostrarModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.headerModal}>
              <h2>Acceso Privado</h2>
              <button onClick={cerrarModal} style={styles.botonCerrar}>✕</button>
            </div>

            <div style={styles.tabsContainer}>
              <button 
                type="button"
                onClick={() => { setPestañaActiva('login'); setInputPassword(''); }} 
                style={{...styles.tab, ...(pestañaActiva === 'login' ? styles.tabActive : {})}}
              >
                Iniciar Sesión
              </button>
              <button 
                type="button"
                onClick={() => { setPestañaActiva('registro'); setInputPassword(''); }} 
                style={{...styles.tab, ...(pestañaActiva === 'registro' ? styles.tabActive : {})}}
              >
                Registrar Mesa
              </button>
            </div>

            <form onSubmit={pestañaActiva === 'login' ? manejarLogin : manejarRegistro} style={styles.formulario}>
              <div style={styles.campo}>
                <label style={styles.label}>Número de Mesa (1-{LIMITE_MAX}):</label>
                <input 
                  type="number" 
                  min="1" 
                  max={LIMITE_MAX} 
                  required 
                  value={inputMesa}
                  onChange={(e) => setInputMesa(e.target.value)}
                  placeholder="Ej: 3"
                  style={styles.input}
                />
              </div>

              <div style={styles.campo}>
                <label style={styles.label}>Contraseña:</label>
                <input 
                  type="password" 
                  required 
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Escribe la clave"
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.botonSubmit}>
                {pestañaActiva === 'login' ? 'Validar y Entrar' : 'Registrar Mesa'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// --- ESTILOS EN LÍNEA ---
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: '#333'
  },
  headerModal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  botonCerrar: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#999'
  },
  tabsContainer: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0'
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  },
  tabActive: {
    color: '#e67e22',
    borderBottom: '3px solid #e67e22'
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'left'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none'
  },
  botonSubmit: {
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  // Estilo limpio para el icono de salida
  botonLogoutIcono: {
    background: 'none',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    marginLeft: '8px',
    padding: '2px',
    verticalAlign: 'middle',
    transition: 'transform 0.2s ease'
  }
};