// src/api.js

export async function fetchPopularMovies() {
    const res = await fetch('http://localhost:8080/popular')
    return await res.json()
}

export async function fetchMoviesBySearch(query) {
    const res = await fetch(`http://localhost:8080/search?query=${query}`)
    return await res.json()
}
