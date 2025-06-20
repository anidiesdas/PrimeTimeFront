<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
      <h1>🦭 Search Results</h1>
    </div>
  </div>

  <div class="movie-list">
    <h2>🔍 "{{ query }}“</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="movies.length === 0">No results found.</div>

    <div v-else class="movie-grid">
      <router-link
          v-for="movie in movies"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="movie-card-link"
      >
        <div class="movie-card">
          <img
              :src="getPosterUrl(movie.poster_path)" alt="Poster" class="poster"/>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { genreMap } from '@/utils/genre.js'

export default {
  setup() {
    const route = useRoute()
    const query = ref(route.params.query)
    const searchQuery = ref(query.value)
    const movies = ref([])
    const isLoading = ref(false)

    const fetchMovies = async () => {
      if (!query.value) return
      isLoading.value = true
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}search/${encodeURIComponent(query.value)}`)
        const data = await res.json()
        movies.value = data.results || []
      } catch (err) {
        console.error('Error...:', err)
      } finally {
        isLoading.value = false
      }
    }

    const getGenreNames = (ids) => {
      if (!Array.isArray(ids)) return 'Unknown'
      return ids.map(id => genreMap[id]).filter(Boolean).join(', ')
    }


    const getPosterUrl = (path) => {
      return path
          ? `https://image.tmdb.org/t/p/w500${path}`
          : 'https://via.placeholder.com/90x135?text=No+Image'
    }

    onMounted(() => {
      fetchMovies()
      searchQuery.value = query.value
    })

    watch(() => route.params.query, (newQuery) => {
      query.value = newQuery
      searchQuery.value = newQuery
      fetchMovies()
    })

    return {
      query,
      searchQuery,
      movies,
      isLoading,
      fetchMovies,
      getGenreNames,
      getPosterUrl
    }
  }
}
</script>


<style scoped>
.searched-query {
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 0.3rem;
}
</style>
