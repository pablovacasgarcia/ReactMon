import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <img src="img/react.png" alt="" className='react'/>
      <img src="img/pokeapi.png" alt="" className='pokeapi'/>
      <img src="img/pokemon.png" alt="" className='portadaPokemon'/>
    </>
  )
}

export default App
