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
      <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card"
      >
        <img :src="getPosterUrl(movie.poster_path)" alt="Poster" class="poster" />
        <div class="movie-details">
          <h3>{{ movie.title }}</h3>
          <p><strong>Genre:</strong><br>{{ movie.genre_ids?.join(', ') }}</p>
          <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import {ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

function search() {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

const movies = ref([])

function getPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : 'https://via.placeholder.com/100x150?text=No+Image'
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:8080/popular')
    const data = await res.json()
    movies.value = data.results
  } catch (err) {
    console.error('Fehler beim Laden der Filme:', err)
  }
})
</script>
