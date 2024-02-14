import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { detalles } from "../Utils/funciones";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Detalle() {
    let { id } = useParams();
    const [datos, setDatos] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const [chartInstance, setChartInstance] = useState(null);
    const canvasRef = useRef(null);

    let pokemon = null;

    useEffect(() => {
        detalles(id).then((data) => {
            setDatos(data);
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`)
                .then(response => response.json())
                .then(data => {
                    const description = data.flavor_text_entries.find(entry => entry.language.name === "es"); 
                    if (description) {
                        setDescripcion(description.flavor_text);
                    } else {
                        setDescripcion("Descripción no disponible");
                    }
                });
        });
    }, [id]);

    useEffect(() => {
        if (datos && canvasRef.current) {
            if (chartInstance) {
                chartInstance.destroy();
            }
            const ctx = canvasRef.current.getContext("2d");
            const newChartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: datos.stats.map((stat) => stat.stat.name.toUpperCase()),
                    datasets: [{
                        label: "Base Stat",
                        data: datos.stats.map((stat) => stat.base_stat),
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChartInstance(newChartInstance);
        }
    }, [datos]);

    if (datos) {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000 
        };

        pokemon = (
            <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 1 }} className="detalle-container">
                    <div className="portada">
                        <h1 className="titulo"><motion.img className="gif" src={datos.sprites.other.showdown.front_default} alt="" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} /> {datos.name} Nº{datos.id.toString().padStart(4, '0')}</h1>
                        <p className="descripcion">{descripcion}</p>
                        <canvas ref={canvasRef} className="stats-chart-container"></canvas>
                    </div>
                    <div className="datos">
                        <div className="tipos">{datos.types.map((type) => <p key={datos.name+type.type.name} className={"tipo "+type.type.name}>{type.type.name}</p>)}</div>
                        <p>Habilidades: {datos.abilities.map((ability) => ability.ability.name).join(", ")}</p>
                        <p className="altura">Altura: {datos.height / 10} m</p>
                        <p className="peso">Peso: {datos.weight / 10} kg</p>
                        <Slider {...settings} className="carrousel">
                            <div>
                                <img src={datos.sprites.other.home.front_default} alt="Frente" />
                            </div>
                            <div>
                                <img src={datos.sprites.other.home.front_shiny} alt="Frente Shiny" />
                            </div>                  
                        </Slider>
                        <audio id="audio" controls>
                            <source src={datos.cries.latest} type="audio/ogg" />
                        </audio>
                    </div>
                </motion.div>
                
            </>
        );
    } else {
        pokemon = <p className="sinPokemon">No hay resultados</p>;
    }

    return <>{pokemon}</>;
}

export default Detalle;
