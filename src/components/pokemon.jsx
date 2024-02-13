import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { detalles } from "../Utils/funciones";

function Pokemon() {
    const [listaPokemons, setListaPokemons] = useState([]);
    const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=9');
    const [loading, setLoading] = useState(true); // Estado para controlar la visibilidad del preload

    function cargarMas() {
        setLoading(true); // Mostrar preload cuando se carguen más datos
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setUrl(data.next); 
            cargarDatos(data.results);
        });
    }

    async function cargarDatos(pokemons) {
        for (let i = 0; i < pokemons.length; i++) {
            const pokemonData = await detalles(pokemons[i].name);
            setListaPokemons(prevPokemons => [...prevPokemons, pokemonData]);
        }
        setLoading(false); // Ocultar preload cuando se hayan cargado todos los datos
    }

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setUrl(data.next);
            cargarDatos(data.results);
        });
    }, []);

    function reproducirSonido(event, pokemon) {
        const audio = new Audio(pokemon.cries.latest);
        audio.play();
    }

    return (
        <>
            <div className="listaPokemon">
                <div className="cartas">
                    {listaPokemons.map(pokemon => (
                        <Link to={"/pokemon/"+pokemon.name} key={pokemon.name} className="carta" onMouseEnter={(event) => reproducirSonido(event, pokemon)}>
                            <div className="contenido">
                                <p className="nombre">{pokemon.name} <span>{pokemon.stats[0].base_stat}</span></p>
                                <img className="imagen" src={pokemon.sprites.other['official-artwork'].front_default} alt="" />
                                <div className="tipos">
                                    {pokemon.types.map(tipo => (
                                        <p key={pokemon.name+tipo.type.name} className={"tipo "+tipo.type.name}>{tipo.type.name}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="fondo"></div>
                        </Link>
                    ))}
                </div>
                <button onClick={cargarMas}>Cargar más...</button>
            </div>
            {loading && ( // Mostrar preload si loading es true
                <div className="preload">
                    <div className="pokemon"></div>
                </div>
            )}
        </>
    );
}

export default Pokemon;
