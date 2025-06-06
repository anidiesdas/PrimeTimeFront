<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>
    <div class="welcome-text">
      <h1>⏰ Dropped</h1>
    </div>
  </div>

  <div class="movie-list">

    <div class="genre-filter">
      <button
          v-for="genre in availableGenres"
          :key="genre"
          :class="{ active: selectedGenres.includes(genre) }"
          @click="toggleGenre(genre)"
      >
        {{ getGenreEmoji(genre) }} {{ genre }}
      </button>
    </div>


    <div class="movie-grid plan-grid">
      <router-link
          v-for="movie in filteredMovies"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="movie-card-link"
      >
        <div class="movie-card">
          <div class="poster fallback-poster">{{ movie.emoji }}</div>
          <div class="movie-details">
            <h3>{{ movie.title }}</h3>
            <p><strong>Genres:</strong> {{ movie.genres.join(', ') }}</p>
            <p><strong>Release Date:</strong> {{ movie.releaseDate }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getGenreEmoji, genreEmojiMap } from '@/genreEmojis'

export default {
  name: 'Dropped',
  data() {
    return {
      movies: [],
      selectedGenres: [],
      availableGenres: Object.keys(genreEmojiMap)
    }
  },
  methods: {
    getGenreEmoji,
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre)
      } else {
        this.selectedGenres.push(genre)
      }
    },
    async fetchDroppedMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/dropped`)
        const data = await res.json()

        this.movies = data.map(movie => ({
          ...movie,
          emoji: this.getEmojiForMovie(movie)
        }))
      } catch (err) {
        console.error('Error fetching dropped movies:', err)
      }
    },
    getEmojiForMovie(movie) {
      const mainGenre = movie.genres?.[0]
      return getGenreEmoji(mainGenre)
    }
  },
  computed: {
    filteredMovies() {
      if (this.selectedGenres.length === 0) return this.movies

      return this.movies.filter(movie =>
          this.selectedGenres.every(selected => movie.genres.includes(selected))
      )
    }
  },
  mounted() {
    this.fetchDroppedMovies()
  }
}
</script>
