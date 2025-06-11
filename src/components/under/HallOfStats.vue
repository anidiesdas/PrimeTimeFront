<template>
  <div class="hall-container">
    <div class="hall">
      <h2>Top 5 Genre👀:</h2>
      <p v-for="(genre, index) in topGenres.slice(0, 5)" :key="'genre' + index">
        {{ index + 1 }}. {{ genre }}
      </p>
    </div>

    <div class="hall">
      <h2>Hall of Fame💅:</h2>
      <p v-for="(movie, index) in topBestMovies.slice(0, 5)" :key="'best' + index">
        {{ index + 1 }}. {{ movie }}
      </p>
    </div>

    <div class="hall">
      <h2>Hall of Shame🤢:</h2>
      <p v-for="(movie, index) in topWorstMovies.slice(0, 5)" :key="'worst' + index">
        {{ index + 1 }}. {{ movie }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HallOfStats",
  data() {
    return {
      topGenres: [],
      topBestMovies: [],
      topWorstMovies: []
    };
  },
  methods: {
    async fetchTopGenres() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}movie/top-genres`);
        this.topGenres = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden der Top-Genres:", err);
      }
    },
    async fetchBestMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/top-rated`);
        this.topBestMovies = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden der bestbewerteten Filme:", err);
      }
    },
    async fetchWorstMovies() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}ratings/worst-rated`);
        this.topWorstMovies = await res.json();
      } catch (err) {
        console.error("Fehler beim Laden der schlechtbewerteten Filme:", err);
      }
    }
  },
  mounted() {
    this.fetchTopGenres();
    this.fetchBestMovies();
    this.fetchWorstMovies();
  }
};
</script>

<style scoped>
.hall-container {
  display: flex;
  justify-content: space-around;
  gap: 5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.hall-container h2 {
  margin-bottom: 0.7rem;
}
.hall p {
  font-size: 20px;
  margin-bottom: 2px;
}
</style>
