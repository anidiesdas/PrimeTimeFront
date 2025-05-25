<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
      <h1>Prime Time :))</h1>
    </div>
  </div>


  <div class="hall-container">
    <div class="hall">
    <h2>Top 3 Genre🤠:</h2>
    <p>1.  {{ topGenres[0]}}</p>
    <p>2.  {{ topGenres[1]}}</p>
    <p>3.  {{ topGenres[2]}}</p>
    </div>

    <div class="hall">
    <h2>Hall of Fame🤩:</h2>
    <p>1. {{topBestMovies[0]}}</p>
    <p>2. {{topBestMovies[1]}}</p>
    <p>3. {{topBestMovies[2]}}</p>
    </div>

    <div class="hall">
    <h2>Hall of Shame🤢:</h2>
    <p>1. {{topWorstMovies[0]}}</p>
    <p>2. {{topWorstMovies[1]}}</p>
    <p>3. {{topWorstMovies[2]}}</p>
    </div>
  </div>

  <div class="movie-list">
    <h2>🎬⭐Trending Movies</h2>
    <div class="movie-grid">
      <router-link
          v-for="movie in movies"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="movie-card-link"
      >
        <div class="movie-card">
          <img :src="getPosterUrl(movie.poster_path)" alt="Poster" class="poster" />
          <div class="movie-details">
            <h3>{{ movie.title }}</h3>
            <p><strong>Genres:</strong> {{ getGenreNames(movie.genre_ids) }}</p>
            <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { genreMap } from '@/genre'

export default {
  data() {
    return {
      movies: [],
      topGenres: [],
      topBestMovies: [],
      topWorstMovies: [],
    }
  },
  computed: {
  },
  methods: {
    getGenreNames(ids) {
      return ids.map(id => genreMap[id]).filter(Boolean).join(', ')
    },
    getPosterUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
    },
    async fetchTopGenres() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/top-genres`);
        this.topGenres = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden der Top-Genres:", err);
      }
    },
    async fetchPopularMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}popular`)
        const data = await res.json()
        this.movies = data.results.slice(0, 6)
      } catch (err) {
        console.error('Fehler beim Laden der populären Filme:', err)
      }
    },
    async fetchBestMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/top-rated`)
        this.topBestMovies = await res.json()
      } catch (err) {
        console.error('Fehler beim Laden der bestbewerteten Filme:', err)
      }
    },
    async fetchWorstMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/worst-rated`)
        this.topWorstMovies = await res.json()
      } catch (err) {
        console.error('Fehler beim Laden der schlechtbewerteten Filme:', err)
      }
    }
  },
  mounted() {
    this.fetchPopularMovies()
    this.fetchTopGenres()
    this.fetchBestMovies()
    this.fetchWorstMovies()
  }
}
</script>

<style>
.hall-container {
  display: flex;
  justify-content: space-around;
  gap: 6rem;
  flex-wrap: wrap;
}
.hall-container h2 {
  margin-bottom: 0.7rem;
}
.hall p{
  font-size: 20px;
  margin-bottom: 2px;
}

</style>