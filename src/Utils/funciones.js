async function detalles(pokemon) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon);
    const data = await response.json();
    return data;
}

export { detalles };
