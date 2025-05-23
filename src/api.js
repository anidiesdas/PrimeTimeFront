// src/api.js

export async function fetchPopularMovies() {
    const res = await fetch('${import.meta.env.VITE_API_URL}/popular')
    return await res.json()
}

export async function fetchMoviesBySearch(query) {
    const res = await fetch('${import.meta.env.VITE_API_URL}/search?query=${query}')
    return await res.json()
}
