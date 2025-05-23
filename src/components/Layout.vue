<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/popular">Trending</router-link>
        <a>Plan To Watch</a>
        <a>Dropped</a>
        <a>Completed</a>
        <a>Statistics</a>
      </div>
    </nav>

    <div class="main-section">
      <div class="main-content">
        <router-view />
      </div>

      <div class="sidebar">
        <input
            v-model="searchQuery"
            @keyup.enter="submitSearch"
            placeholder="Search..."
            class="search-input"
        />

        <h4><strong>SDD Stats</strong></h4>
        <p class="spacer"></p>

        <p>Plan To Watch: {{ statusCounts.PLAN_TO_WATCH || 0 }}</p>
        <p>Dropped: {{ statusCounts.DROPPED || 0 }}</p>
        <p>Completed: {{ statusCounts.COMPLETED || 0 }}</p>
        <p class="spacer"></p>

        <p><strong>Mean scores:</strong></p>
        <p>{{averageScore}}</p>
        <p class="spacer"></p>

        <p><strong>Top 3 Genre:</strong></p>
        <p>1.  {{ topGenres[0]}}</p>
        <p>2.  {{ topGenres[1]}}</p>
        <p>3.  {{ topGenres[2]}}</p>
        <p class="spacer"></p>

        <p><strong>Hall of Fame:</strong></p>
        <p>1. {{topBestMovies[0]}}</p>
        <p>2. {{topBestMovies[1]}}</p>
        <p>3. {{topBestMovies[2]}}</p>
        <p class="spacer"></p>

        <p><strong>Walk of Shame:</strong></p>
        <p>1. {{topWorstMovies[0]}}</p>
        <p>2. {{topWorstMovies[1]}}</p>
        <p>3. {{topWorstMovies[2]}}</p>
        <p class="spacer"></p>

        <p><strong>Total minutes: </strong>{{ totalMinutes }}</p>
        <p class="spacer"></p>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      searchQuery: '',
      totalMinutes: 0,
      statusCounts: {},
      topGenres: [],
      averageScore: 0,
      topBestMovies: [],
      topWorstMovies: [],
    }
  },
  methods: {
    submitSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push(`/search/${encodeURIComponent(this.searchQuery.trim())}`)
      }
    },
    async fetchTotalRuntime() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/total-runtime`);
        this.totalMinutes = await res.json();
      } catch (err) {
        console.error("Couldnt load runtime:", err);
      }
    },
    async fetchStatusCounts() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}movie/status-counts`);
        this.statusCounts = res.data;
      } catch (err) {
        console.error("Fehler beim Laden der Status-Zahlen:", err);
      }
    },
    async fetchTopGenres() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/top-genres`);
        this.topGenres = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden der Top-Genres:", err);
      }
    },
    async fetchAverageRating() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/average-rating`);
        this.averageScore = await res.json();
      } catch (err) {
        console.error("Fehler beim Abrufen des Durchschnitts:", err);
      }
    },
    async fetchBestMovies() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/top-rated`);
      this.topBestMovies = await res.json();
    },
    async fetchWorstMovies() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/worst-rated`);
      this.topWorstMovies = await res.json();
    },
  },
  mounted() {
    this.fetchTotalRuntime();
    this.fetchStatusCounts();
    this.fetchTopGenres();
    this.fetchAverageRating();
    this.fetchBestMovies();
    this.fetchWorstMovies();
  }
}
</script>

<style>
h4 {
  margin: 0 0 0 0;
  font-family: "Special Gothic Expanded One";
}
</style>