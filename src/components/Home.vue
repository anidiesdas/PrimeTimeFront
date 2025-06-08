<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
      <h1>Prime Time :))</h1>
    </div>
  </div>

  <StatusCounts/>

  <hr class="custom-line" />

  <div class="hall-container">
    <div class="hall">
    <h2>Top 3 Genre👀:</h2>
    <p v-for="(genre, index) in topGenres.slice(0, 5)" :key="'genre' + index">
      {{ index + 1 }}. {{ genre }}
    </p>
    </div>

    <div class="hall">
    <h2>Hall of Fame💅:</h2>
      <p v-for="(movie, index) in topBestMovies.slice(0, 5)" :key="'best' + index">
        {{ index + 1 }}. {{ movie }}
      </p>
    </div>

    <div class="hall">
    <h2>Hall of Shame🤢:</h2>
      <p v-for="(movie, index) in topWorstMovies.slice(0, 5)" :key="'worst' + index">
        {{ index + 1 }}. {{ movie }}
      </p>
    </div>
  </div>

  <hr class="custom-line" />

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
import StatusCounts from "@/components/Charts/StatusCounts.vue";

export default {
  components: {StatusCounts},
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
  gap: 5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.hall-container h2 {
  margin-bottom: 0.7rem;
}
.hall p{
  font-size: 20px;
  margin-bottom: 2px;
}

</style>
