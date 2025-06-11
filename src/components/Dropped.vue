<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>
    <div class="welcome-text">
      <h1>🫸 Dropped</h1>
    </div>
  </div>

  <div class="movie-list">

    <div class="top-bar">
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

      <div class="sort-buttons">
        <button
            :class="{ active: sortKey === 'title' }"
            @click="setSort('title')"
        >
          Sort by: A → Z
        </button>
        <button
            :class="{ active: sortKey === 'releaseDate' }"
            @click="setSort('releaseDate')"
        >
          Sort by: 📅 Release Date
        </button>
      </div>
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
import { getGenreEmoji, genreEmojiMap } from '@/utils/genreEmojis.js'

export default {
  data() {
    return {
      movies: [],
      selectedGenres: [],
      availableGenres: Object.keys(genreEmojiMap),
      sortOrder: 'asc',
      sortKey: 'title',
    }
  },
  methods: {
    getGenreEmoji,
    toggleGenre(genre) {
      this.selectedGenres = this.selectedGenres.includes(genre)
          ? this.selectedGenres.filter(g => g !== genre)
          : [...this.selectedGenres, genre]
    },
    setSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
    },
    async fetchDroppedMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/dropped`)
        const data = await res.json()

        this.movies = data.map(movie => ({
          ...movie,
          emoji: this.getEmojiForMovie(movie)
        }));

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
      let result = this.movies

      if (this.selectedGenres.length > 0) {
        result = result.filter(movie =>
            this.selectedGenres.every(g => movie.genres.includes(g))
        )
      }

      result = [...result].sort((a, b) => {
        if (this.sortKey === 'title') {
          return this.sortOrder === 'asc'
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title)
        } else if (this.sortKey === 'releaseDate') {
          const dateA = new Date(a.releaseDate)
          const dateB = new Date(b.releaseDate)
          return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        }
        return 0
      })

      return result
    }
  },
  mounted() {
    this.fetchDroppedMovies()
  }
}
</script>