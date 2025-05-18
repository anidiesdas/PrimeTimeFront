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
          :key="genre.id"> {{ genre.name }}
      </span>
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

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import Rating from './Rating.vue'
  import MovieSeen from './MovieSeen.vue'

  const route = useRoute()

  const movie = ref({})
  const showRating = ref(false)
  const ratings = ref([])

  const productionCountries = computed(() =>
  movie.value.production_countries?.map(c => c.name).join(', ') || ''
  )

  const posterUrl = computed(() =>
  movie.value.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
  : ''
  )

  onMounted(async () => {
  try {
  const response = await fetch(`http://localhost:8080/movie/${route.params.id}`)
  const data = await response.json()
  data.releaseDate = data.release_date
  data.runningTime = data.runtime
  movie.value = data

  const statusResponse = await fetch(`http://localhost:8080/movie/status/${route.params.id}`)
  if (statusResponse.status === 404) {
  showRating.value = true
} else {
  const rawText = await statusResponse.text()
  const dbStatus = JSON.parse(rawText)
  showRating.value = dbStatus === 'PLAN_TO_WATCH' || dbStatus === 'null'
}

  const ratingRes = await fetch(`http://localhost:8080/movie/ratings/${route.params.id}`)
  if (ratingRes.ok) {
  ratings.value = await ratingRes.json()
} else {
  console.warn("Keine Ratings gefunden")
}
} catch (err) {
  console.error("Fehler beim Laden:", err)
}
})
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
  background-color: #415a77;
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

</style>