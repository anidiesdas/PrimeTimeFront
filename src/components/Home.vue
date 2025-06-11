<template xmlns="http://www.w3.org/1999/html">
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
      <h1>Prime Time :))</h1>
    </div>
  </div>

  <StatusCounts/>

  <hr class="custom-line" />

  <div class="hall-container" v-if="monthlyRecap">

    <div class="hall" style="width: 800px">
      <h2>🍿YOUR MONTHLY RECAP</h2>
      <div style="margin-left: 2.4rem">
      <p>You watched <strong>{{ monthlyRecap.totalMoviesWatched }}</strong> movies together in {{ monthlyRecap.monthName }}!!</p>
      <p class="spacer" style="margin: 0.5rem"></p>
      <p v-if="comparisonText" v-html="comparisonText"></p>
      <p class="spacer"></p>
      <p>💯{{ monthlyRecap.bestRatedMovie }} >>>>👎{{ monthlyRecap.worstRatedMovie }}</p>
      <p class="spacer"></p>
      <p><strong>Top Genres:</strong> {{ monthlyRecap.topGenres.join(', ') }}</p>
      </div>
    </div>

    <div class="hall">
      <p style="font-size: 180px; margin: 2rem 0 -3rem -4rem; ">❤️‍🔥</p>
    </div>

  </div>

  <hr class="custom-line" />

  <div class="movie-list">
    <h2>🎬⭐TRENDING MOVIES</h2>
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
import { genreMap } from '@/utils/genre.js'
import StatusCounts from "@/components/charts/StatusCounts.vue";
import { getRandomComparison } from "@/utils/timeComparisons.js"

export default {
  components: {StatusCounts},
  data() {
    return {
      movies: [],
      monthlyRecap: null,
      comparisonText: '',
      topGenres: [],
      topBestMovies: [],
      topWorstMovies: [],
    }
  },
  computed: {
  },
  methods: {
    getGenreNames(ids) {
      return ids.map(id => genreMap[id]).filter(Boolean).join(', ')
    },
    getPosterUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w500${path}` : ''
    },
    async fetchMonthlyRecap() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/monthly-recap`)
        this.monthlyRecap = await res.json()
        this.comparisonText = getRandomComparison(this.monthlyRecap.totalRuntime);
      } catch (err) {
        console.error('Fehler beim Laden des Monatsrückblicks:', err)
      }
    },
    async fetchPopularMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}popular`)
        const data = await res.json()
        this.movies = data.results.slice(0, 6)
      } catch (err) {
        console.error('Fehler beim Laden der populären Filme:', err)
      }
    },
  },
  mounted() {
    this.fetchPopularMovies()
    this.fetchMonthlyRecap()
  }
}
</script>

<style>
.hall-container {
  display: flex;
  justify-content: normal;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.hall-container h2 {
  margin-bottom: 0.7rem;
}
.hall p{
  font-size: 20px;
  margin: 0 0 2px 0;
}
.hall .spacer {
  margin: 1.5rem;
}
</style>
