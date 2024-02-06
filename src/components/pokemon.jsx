import { useState, useEffect } from "react";
let url;

function Pokemon(){
    
  const[listaPokemons, setListaPokemons] = useState([]);

    function cargarMas(){
        fetch(url)
        .then(response => response.json())
        .then(data => {
            url=data.next
            setListaPokemons([...listaPokemons,...data.results])
        });
    }

    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=8')
        .then(response => response.json())
        .then(data => {
            url=data.next;
            setListaPokemons([...listaPokemons,...data.results])
        });
    }, []);

    let lista = listaPokemons.map(pokemon=><li key={pokemon.name}>{pokemon.name}</li>)

    return(
        <>
            {lista}
            <button onClick={cargarMas}>Cargar más...</button>
        </>
    )

}

export default Pokemon;