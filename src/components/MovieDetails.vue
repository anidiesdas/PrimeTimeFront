<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>{{ movie.title }}</h1>
  </div>
  </div>

  <div class="movie-layout">
    <div class="left-column">
      <img :src="posterUrl" class="poster" />

      <div class="ratings-box">
        <div v-for="r in ratings" :key="r.memberId" class="rating-pill">
          {{ r.memberName }}: {{ r.rating }}
        </div>
      </div>
    </div>


    <div class="movie-info">
      <p><strong>{{ movie.runtime }}min</strong></p>
      <div class="genre-tags">
  <span
      class="genre-pill"
      v-for="genre in movie.genres"
      :key="genre.id"
  >{{ genre.name }}</span>

        <span
            class="tags-pill"
            v-for="(tag, index) in tags"
            :key="index"
        >{{ tag }}</span>
      </div>



      <p><strong>Release Date:</strong> {{ movie.releaseDate}}</p>
      <p><strong>Production:</strong> {{ productionCountries }}</p>
      <p><strong>Overview:</strong> {{ movie.overview }}</p>
      <Rating
          v-if="showRating"
          :movie-id="movie.id"
          :movie-title="movie.title"
          :movie-runtime="movie.runningTime"
          :movie-release-date="movie.releaseDate"
          :movie-genres="movie.genres"
      />
      <MovieSeen
          v-if="!showRating && movie.id"
          :movie-id="movie.id"
      />
    </div>
  </div>
</template>

<script>
import Rating from './Rating.vue'
import MovieSeen from './MovieSeen.vue'

export default {
  components: {
    Rating,
    MovieSeen
  },
  data() {
    return {
      movie: {},
      showRating: false,
      ratings: [],
      tags: [],
      routeId: this.$route.params.id
    }
  },
  computed: {
    productionCountries() {
      return this.movie.production_countries?.map(c => c.name).join(', ') || ''
    },
    posterUrl() {
      return this.movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
          : ''
    }
  },
  methods: {
    async fetchMovieDetails() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}movie/${this.routeId}`)
      const data = await response.json()
      data.releaseDate = data.release_date
      data.runningTime = data.runtime
      this.movie = data
    },
    async fetchMovieStatus() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}movie/status/${this.routeId}`)
      if (response.status === 404) {
        this.showRating = true
      } else {
        const rawText = await response.text()
        const dbStatus = JSON.parse(rawText)
        this.showRating = dbStatus === 'PLAN_TO_WATCH' || dbStatus === 'null'
      }
    },
    async fetchRatings() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}ratings/movie/${this.routeId}`)
      if (response.ok) {
        this.ratings = await response.json()
      } else {
        console.warn("Keine Ratings gefunden")
      }
    },
    async fetchTags() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}movie/${this.routeId}/tags`)
      if (response.ok) {
        this.tags = await response.json()
      } else {
        console.warn("Keine Tags vorhanden")
      }
    }
  },
  mounted() {
    this.fetchMovieDetails()
    this.fetchMovieStatus()
    this.fetchRatings()
    this.fetchTags()
  }
}
</script>



<style scoped>
.movie-layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin: 1.5rem 0 3rem 1rem;
}
.left-column {
  display: flex;
  flex-direction: column;
  margin: 0
}
.poster {
  width: 280px;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  margin: 0;
}
.ratings-box {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}
.rating-pill {
  background-color: #3a2c5c;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-family: "Special Gothic Expanded One";
  color: white;
}
.movie-info p {
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 20px;
}
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-pill {
  padding: 0.4rem 0.8rem;
  border: 1px solid #999;
  border-radius: 999px;
  background-color: #A3CDF472;
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
  font-family: "Special Gothic Expanded One";
}
.tags-pill {
  padding: 0.4rem 0.8rem;
  border: 1px solid #999;
  border-radius: 999px;
  background-color: rgba(134, 53, 161, 0.52);
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
  font-family: "Special Gothic Expanded One";
  margin: 0 0 0 0;
}
</style>

<!--TODO Movie delete-->