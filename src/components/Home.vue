<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
      <h1>Prime Time :))</h1>
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



<script setup>
import {ref, onMounted} from 'vue'
import { genreMap } from '@/genre'

const getGenreNames = (ids) => {
  return ids.map(id => genreMap[id]).filter(Boolean).join(', ')
}

const movies = ref([])

function getPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
}

onMounted(async () => {
  try {
    const res = await fetch('${import.meta.env.VITE_API_URL}/popular')
    const data = await res.json()
    movies.value = data.results
  } catch (err) {
    console.error('Error:', err)
  }
})
</script>


<!--TODO Genre-Mapping-->