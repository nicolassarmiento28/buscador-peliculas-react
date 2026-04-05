import React from "react";
import { useState, useEffect } from "react";

export const BuscadorPeliculas = () => {
  const urlBase = "https://api.themoviedb.org/3/search/movie?query=";
  const apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDg1ZjkyMTE0YWVhOTBjNzEzMmNiNDhkNTUwODMzYiIsIm5iZiI6MTc3NDEwODIyMy4wNzUsInN1YiI6IjY5YmViZTNmNmRjY2Q0ZTljMTcyMmE1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tCuwAEv04zm4zd02nTwTrPIbtSPqzzqnYQNTvoDabp8";

  const [pelicula, setPelicula] = useState("");
  const [peliculasEncontradas, setPeliculasEncontradas] = useState([]);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleInputChange = (event) => {
    setPelicula(event.target.value);
  };

  const fetchPeliculas = async () => {
    try {
      const response = await fetch(`${urlBase}${encodeURIComponent(pelicula)}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const data = await response.json();
      setPeliculasEncontradas(data.results ?? []);

    } catch (error) {
      console.error("Ha ocurrido un error:", error);
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    fetchPeliculas();
  };

  return (
    <div className="container">
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        title={`Cambiar a ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <span className="theme-toggle-icon">
          {theme === "dark" ? "☀️" : "🌙"}
        </span>
      </button>

      <h1 className="title">Buscador de Películas</h1>

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Busca una película..."
          value={pelicula}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">Buscar</button>
      </form>
      
      <div className="movie-list">
        {peliculasEncontradas.map((pelicula) => (
          <div key={pelicula.id} className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} alt={pelicula.title} className="movie-poster" />
            <h2>{pelicula.title}</h2>
            <p>{pelicula.overview}</p>
          </div>
        ))}

      </div>
    </div>
  );
};