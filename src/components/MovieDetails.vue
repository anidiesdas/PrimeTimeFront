<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>{{ movie.title }}</h1>
  </div>
  </div>

  <div class="movie-layout">
    <img :src="posterUrl" alt="Movie Poster" class="movie-poster" />
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
          :movie-id="movie.id"
          :movie-title="movie.title"
          :movie-runtime="movie.runningTime"
          :movie-release-date="movie.releaseDate"
          :movie-genres="movie.genres"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Rating from './Rating.vue'

const route = useRoute()
const movie = ref({})

onMounted(async () => {
  const response = await fetch(`http://localhost:8080/movie/${route.params.id}`)
  const data = await response.json();
  data.releaseDate = data.release_date;
  data.runningTime = data.runtime;
  movie.value = data;
})

// genre mapping
const genreList = computed(() =>
    movie.value.genres?.map(g => g.name).join(', ') || ''
)

// produktionsländer
const productionCountries = computed(() =>
    movie.value.production_countries?.map(c => c.name).join(', ') || ''
)

const posterUrl = computed(() =>
    movie.value.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
        : ''
)

const selectedDate = ref('')
const selectedStatus = ref('')
const selectedPlatform = ref('')
const tags = ref([])
const selectedUsers = ref([])
const userReviews = ref({})

const payload = computed(() => ({
  movie: {
    id: movie.value.id,
    title: movie.value.title,
    genre: movie.value.genre,
    runningTime: movie.value.runningTime,
    releaseDate: movie.value.releaseDate,
    watchDate: selectedDate.value
  },
}))
</script>


<style scoped>
.movie-layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 1.5rem;
  margin-left: 1rem;
}

.movie-poster {
  width: 280px;
  border-radius: 8px;
  object-fit: cover;
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