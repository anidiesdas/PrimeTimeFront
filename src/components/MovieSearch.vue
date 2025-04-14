<template>
  <div>
    <input v-model="searchQuery" @keyup.enter="searchMovies" placeholder="Film suchen..." />
    <div v-if="movies.length">
      <div v-for="movie in movies" :key="movie.id">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.overview }}</p>
      </div>
    </div>
    <div v-else>
      <p>Keine Filme gefunden.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieSearch',
  props: ['query'],
  data() {
    return {
      movies: []
    }
  },
  mounted() {
    this.fetchMovies()
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await axios.get(`http://localhost:8080/search/${this.query}`)
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        this.movies = data.results || []
      } catch (error) {
        console.error('❌ Fehler beim Laden der Suchergebnisse:', error)
      }
    }
  }
}
</script>
