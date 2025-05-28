<template>
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/popular">Trending</router-link>
        <router-link to="/plantowatch">Plan To Watch</router-link>
        <router-link to="/completed">Completed</router-link>
        <router-link to="/dropped">Dropped</router-link>
        <router-link to="/statistics">Statistics</router-link>
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

        <p>⏰Plan To Watch: {{ statusCounts.PLAN_TO_WATCH || 0 }}</p>
        <p>🫸Dropped: {{ statusCounts.DROPPED || 0 }}</p>
        <p>✅Completed: {{ statusCounts.COMPLETED || 0 }}</p>
        <p class="spacer"></p>

        <p><strong>Mean scores:</strong></p>
        <p>💩{{averageScore.toFixed(4)}}💩</p>
        <p class="spacer"></p>

        <div class= "member-rating" v-for="entry in memberRatings" :key="entry.memberName">
          {{ entry.averageRating.toFixed(2) }}🤍 - {{ entry.memberName }}
        </div>
        <p class="spacer"></p>


        <p><strong>Total minutes: </strong>{{ totalMinutes }}</p>
        <p class="spacer"></p>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Statistics from "@/components/Statistics.vue";

export default {
  components: {Statistics},
  data() {
    return {
      searchQuery: '',
      totalMinutes: 0,
      statusCounts: {},
      averageScore: 0,
      memberRatings: [],
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
    async fetchAverageRating() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/average-rating`);
        this.averageScore = await res.json();
      } catch (err) {
        console.error("Fehler beim Abrufen des Durchschnitts:", err);
      }
    },
    async fetchMemberRatings() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/average-by-member`)
        this.memberRatings = await res.json()
      } catch (err) {
        console.error('Fehler beim Laden der Durchschnittswerte:', err)
      }
    },
  },
  mounted() {
    this.fetchTotalRuntime();
    this.fetchStatusCounts();
    this.fetchAverageRating();
    this.fetchMemberRatings();
  }
}
</script>

<style>
h4 {
  margin: 0 0 0 0;
  font-family: "Special Gothic Expanded One";
}

.member-rating {
  list-style: none;
}
</style>