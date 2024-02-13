import React, { useState, useEffect } from "react";
import { detalles } from "../Utils/funciones";
import { motion } from "framer-motion";
import { db, auth } from "../Utils/firebase";
import { collection, doc, setDoc, getDocs, orderBy, limit, query, where } from "firebase/firestore";

function Jugar() {
    const [pokemon, setPokemon] = useState(null);
    const [opciones, setOpciones] = useState([]);
    const [nombreCorrecto, setNombreCorrecto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(true); 
    const [brillo, setBrillo] = useState(0);
    const [puntuacion, setPuntuacion] = useState(0);
    const [topPuntuaciones, setTopPuntuaciones] = useState([]);

    useEffect(() => {
        cargarTopPuntuaciones();
        reiniciarJuego();
    }, []);

    function cargarTopPuntuaciones () {
        const puntuacionesQuery = query(collection(db, "puntuaciones"), orderBy("puntuacion", "desc"), limit(5));
        const puntuaciones = [];

        getDocs(puntuacionesQuery).then((datos)=>{
            datos.forEach((doc) => {
                puntuaciones.push(doc.data());
            });
            setTopPuntuaciones(puntuaciones);
            
            
            getDocs(query(collection(db, "puntuaciones"), where("usuario", "==", auth.currentUser.displayName))).then(puntos=>{
                setPuntuacion(puntos.docs[0].data().puntuacion);
            }).catch(()=>{
                setPuntuacion(0);
            });

        });        
    };

    const reiniciarJuego = () => {
        setBrillo(0);
        setMensaje('');
        setLoading(true); 
        const peticiones = [];
        for (let i = 0; i < 4; i++) {
            peticiones.push(detalles(generarNumeroAleatorio()));
        }
        Promise.all(peticiones)
            .then((resultados) => {
                const nombres = resultados.map((resultado) => resultado.name);
                const nombreCorrecto = nombres[Math.floor(Math.random() * nombres.length)];
                setNombreCorrecto(nombreCorrecto);
                const opcionesAleatorias = shuffle(nombres);
                setOpciones(opcionesAleatorias);
                return detalles(obtenerIdPokemon(nombreCorrecto));
            })
            .then((data) => {
                setPokemon(data.sprites.other.showdown.front_default);
                reproducirSonido();
                setLoading(false); 
            })
    };

    const generarNumeroAleatorio = () => {
        return Math.floor(Math.random() * 898) + 1;
    };

    const obtenerIdPokemon = (nombrePokemon) => {
        return nombrePokemon;
    };

    const shuffle = (array) => {
        const newArray = array.slice();
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleOpcionSeleccionada = (opcion) => {
        let nuevaPuntuacion = puntuacion;
        if (opcion === nombreCorrecto) {
            setMensaje("¡Correcto!");
            setBrillo(100);
            nuevaPuntuacion += 2;
        } else {
            setMensaje("Incorrecto. El nombre correcto es: " + nombreCorrecto);
            setBrillo(100);
            nuevaPuntuacion -= 1;
            if (nuevaPuntuacion < 0) {
                nuevaPuntuacion = 0;
            }
        }
        setPuntuacion(nuevaPuntuacion);
        
        const usuario = auth.currentUser;
        if (usuario) {
            const usuarioId = usuario.displayName;
            const puntuacionesRef = collection(db, "puntuaciones");
            const puntuacionRef = doc(puntuacionesRef, usuarioId);
            setDoc(puntuacionRef, { usuario: usuarioId, puntuacion: nuevaPuntuacion }).then(()=>{
                cargarTopPuntuaciones();
            });
        }
    };
    

    function reproducirSonido() {
        const audio = new Audio('./img/quien.mp3');
        audio.play();
    }

    return (
        <div className="jugar-container">
            {loading ? ( 
                <div className="preload">
                    <div className="pokemon"></div>
                </div>
            ) : (
                <>
                    {pokemon && (
                        <motion.img
                            className="pokemon-imagen"
                            src={pokemon}
                            alt="Imagen del Pokémon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ filter: `brightness(${brillo}%)` }}
                        />
                    )}
                    <div className="opciones-container">
                        {opciones.map((opcion, index) => (
                            <button
                                key={index}
                                className="opcion-button"
                                onClick={() => handleOpcionSeleccionada(opcion)}
                            >
                                {opcion}
                            </button>
                        ))}
                    </div>
                    <div className="puntuaciones-container">
                        <h2 className="top">Top 5 Puntuaciones</h2>
                        <ol>
                            {topPuntuaciones.map((puntuacion, index) => (
                                <li key={index}>{puntuacion.usuario}: {puntuacion.puntuacion}</li>
                            ))}
                        </ol>
                        <h2 className="misPuntos">Mi Puntuación: {puntuacion}</h2>
                    </div>
                    {mensaje && (
                        <div className="final">
                            <p className="mensaje">{mensaje}</p>
                            <button onClick={reiniciarJuego}>Jugar de nuevo</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Jugar;
