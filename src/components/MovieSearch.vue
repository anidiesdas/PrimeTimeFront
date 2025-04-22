<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-links">
        <a>Trending</a>
        <a>Plan To Watch</a>
        <a>Dropped</a>
        <a>Completed</a>
        <a>Statistics</a>
      </div>
    </nav>

    <div class="main-section">
      <!-- Linker Bereich -->
      <div class="main-content">
        <div class="welcome-wrapper">
          <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
          <div class="welcome-text">
            <h1>Search Results 🔍</h1>
          </div>
        </div>

        <div class="movie-list">
          <h2>„{{ query }}“</h2>
          <div v-if="isLoading">Loading...</div>
          <div v-else-if="movies.length === 0">No results found.</div>

          <div v-else class="movie-grid">
            <div v-for="movie in movies" :key="movie.id" class="movie-card">
              <img :src="getPosterUrl(movie.poster_path)" alt="Poster" class="poster" />
              <div class="movie-details">
                <h3>{{ movie.title }}</h3>
                <p><strong>Genre:</strong><br>{{ movie.genre_ids?.join(', ') }}</p>
                <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rechte Seite: Sidebar -->
      <div class="sidebar">
        <input
            type="text"
            class="search-input"
            placeholder="Search..."
            v-model="searchQuery"
            @keyup.enter="submitSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const query = ref(route.params.query)
const movies = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const fetchMovies = async () => {
  if (!query.value) return
  isLoading.value = true
  try {
    const res = await fetch(`http://localhost:8080/search/${encodeURIComponent(query.value)}`)
    const data = await res.json()
    movies.value = data.results || []
  } catch (err) {
    console.error('Fehler beim Abrufen der Filme:', err)
  } finally {
    isLoading.value = false
  }
}

// Funktion, um ein neues Suchergebnis auszulösen
const submitSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// Neue Anfrage bei URL-Wechsel
watch(() => route.params.query, (newQuery) => {
  query.value = newQuery
  searchQuery.value = newQuery
  fetchMovies()
})

// Initialer Aufruf
onMounted(() => {
  searchQuery.value = query.value
  fetchMovies()
})

// Bild-URL zusammenbauen
const getPosterUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/90x135?text=No+Image'
</script>

