<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>🎬⭐Trending Movies</h1>
  </div>
  </div>

  <div class="movie-list">
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
  name: 'YourComponentName',
  data() {
    return {
      movies: []
    }
  },
  methods: {
    getGenreNames(ids) {
      return ids.map(id => genreMap[id]).filter(Boolean).join(', ')
    },
    getPosterUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
    },
    async fetchPopularMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}popular`)
        const data = await res.json()
        this.movies = data.results
      } catch (err) {
        console.error('Error:', err)
      }
    }
  },
  mounted() {
    this.fetchPopularMovies()
  }
}
</script>
