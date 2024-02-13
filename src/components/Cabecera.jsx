import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Utils/firebase';

function Cabecera() {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleKey = (event) => {
    if (event.key === 'Enter') {
        navigate("/pokemon/"+searchTerm)
        setSearchTerm('')
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const cerrarSesion = () => {
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  return (
    <header>
        <img src="./img/logo.png" alt="" />
        <nav>
            <Link to="/">Inicio</Link>
            <Link to="/pokemon">Pokemon</Link>
            {user ? (
              <>
                <Link to="/jugar">Jugar</Link>
                <Link onClick={cerrarSesion}>Cerrar Sesión</Link>
              </>
            ) : (
              <Link to="/login">Iniciar Sesión</Link>
            )}
        </nav>
        <input className='busqueda' type="text" value={searchTerm} onChange={handleChange} onKeyUp={handleKey} placeholder="Buscar Pokémon..." />
    </header>
  );
}

export default Cabecera;
