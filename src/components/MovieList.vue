<template>
  <div style="text-align: center; padding: 2rem;">
    <h2>🎬 Top 20 Filme</h2>
    <ul style="list-style: none; padding: 0;">
      <li v-for="movie in movies" :key="movie.id" style="margin-bottom: 1.5rem;">
        <h3>{{ movie.title }}</h3>
        <p><strong>Veröffentlichung:</strong> {{ movie.release_date }}</p>
        <p>{{ movie.overview }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MovieList',
  data() {
    return {
      movies: []
    }
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:8080/popular");
      const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      this.movies = parsed.results || []
    } catch (err) {
      console.error('Fehler beim Laden der Filme:', err)
    }
  }
}
</script>
