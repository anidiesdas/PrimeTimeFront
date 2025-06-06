<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>
    <div class="welcome-text">
      <h1>⏰ Plan to Watch</h1>
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
  name: 'PlanToWatch',
  data() {
    return {
      movies: [],
      selectedGenres: [],
      availableGenres: Object.keys(genreEmojiMap),
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
    async fetchPlannedMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/plantowatch`)
        const data = await res.json()

        const genresSet = new Set()
        data.forEach(movie => {
          movie.genres.forEach(genre => genresSet.add(genre))
        })

        this.movies = data.map(movie => ({
          ...movie,
          emoji: this.getEmojiForMovie(movie)
        }));

      } catch (err) {
        console.error('Error fetching plan-to-watch movies:', err)
      }
    },
    getEmojiForMovie(movie) {
      const mainGenre = movie.genres?.[0]
      return getGenreEmoji(mainGenre)
    }
  },
  computed: {
    filteredMovies() {
      if (this.selectedGenres.length === 0) return this.movies;

      return this.movies.filter(movie =>
          this.selectedGenres.every(selected => movie.genres.includes(selected))
      )
    }
  },
  mounted() {
    this.fetchPlannedMovies()
  }
}
</script>

<style>
.genre-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-filter button {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #aaa;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
  color: white;
}

.genre-filter button.active {
  background: #d884cb;
  color: white;
  border-color: #d884cb;
}
.plan-grid .movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #2e2e2e;
  border-radius: 12px;
  padding: 1rem 0.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  min-height: 230px;
  text-align: center;
  justify-content: space-between;
  height: 100%;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* nur hier schmaler */
  gap: 1rem;
}

.plan-grid .poster {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
}

.plan-grid .movie-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px
}

.plan-grid .movie-card h3 {
  margin-bottom: 0.4rem;
  font-size: 1rem;
  word-break: break-word;
}

</style>