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

      <p v-if="averageMovieRating !== null">
        {{ averageMovieRating.toFixed(2) }}⭐
      </p>

      <div class="ratings-box">
        <div v-for="r in ratings" :key="r.memberId" class="rating-pill">
          {{ r.memberName }}: {{ r.rating }}
        </div>
      </div>

      <button
          v-if="hasStatus"
          class="delete-button"
          @click="requestPassword(confirmDelete)"
      >
        🗑️ Delete
      </button>

      <div v-if="showPasswordModal" class="modal">
        <div class="modal-content">
          <input type="password" v-model="enteredPassword" placeholder="Enter password" />
          <button @click="confirmPassword">OK</button>
          <button @click="cancelPassword">Cancel</button>
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
        >{{ genre.name }}
        </span>

        <span
            class="tags-pill"
            v-for="(tag, index) in tags"
            :key="index"
        >{{ tag }}
        </span>

        </div>

      <p>
        <strong>Release Date:</strong> {{ movie.releaseDate }}
        <span v-if="watchDate"> // <strong>Watch Date:</strong> {{ watchDate }}</span>
      </p>

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
          v-if="!showRating"
          :movie-id="movie.id"
      />

      <p v-if="alreadyPlanned" style="color: #4488ca;">P.S. Dieser Film ist bereits in der Watchlist.</p>
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
      watchDate: null,
      alreadyPlanned: false,
      ratings: [],
      tags: [],
      routeId: this.$route.params.id,
      movieStatus: null,
      showPasswordModal: false,
      enteredPassword: '',
      passwordCallback: null,
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
    },
    averageMovieRating() {
      if (this.ratings.length === 0) return null;
      const total = this.ratings.reduce((sum, entry) => sum + entry.rating, 0);
      return total / this.ratings.length;
    },
    hasStatus() {
      return this.movieStatus !== null;
    },
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}movie/status/${this.routeId}`);
      const text = await response.text();
      if (!text) {
        this.showRating = true;
        this.movieStatus = null
        return;
      }

      const data = JSON.parse(text);

      if (data === null) {
        this.showRating = true;
        this.movieStatus = null
        return;
      }

      this.movieStatus = data.status;
      this.showRating = data.status === 'PLAN_TO_WATCH' || data.status === null;
      this.alreadyPlanned = data.status === 'PLAN_TO_WATCH';
      this.watchDate = data?.watchDate || null;
    },
    async fetchRatings() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}ratings/movie/${this.routeId}`)
      if (response.ok) {
        this.ratings = await response.json()
      } else {
        console.log("Keine Ratings gefunden")
      }
    },
    async fetchTags() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}movie/${this.routeId}/tags`);
        if (!response.ok) {
          console.log("Fehler beim Laden der Tags");
          return;
        }
        const text = await response.text();
        if (!text) {
          console.log("Keine Tags vorhanden");
          return;
        }
        this.tags = JSON.parse(text);
      } catch (err) {
        console.log("Fehler beim Parsen der Tags");
      }
    },
    requestPassword(callback) {
      this.passwordCallback = callback
      this.showPasswordModal = true
    },
    confirmPassword() {
      this.showPasswordModal = false
      if (this.passwordCallback) {
        this.passwordCallback(this.enteredPassword)
      }
      this.enteredPassword = ''
    },
    cancelPassword() {
      this.showPasswordModal = false
      this.enteredPassword = ''
    },
    confirmDelete(password) {
      if (!password) {
        console.log('Abgebrochen')
        return
      }

      fetch(`${import.meta.env.VITE_API_URL}movie/${this.routeId}?password=${password}`, {
        method: 'DELETE'
      })
          .then(res => {
            if (res.status === 200) {
              this.$router.push('/')
            } else if (res.status === 403) {
              alert('Falsches Passwort')
            } else {
              alert('Fehler beim Löschen')
            }
          })
          .catch(err => console.error(err))
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
  margin: 0;
  width: 300px;
  align-items: center;
}
.left-column p {
  font-size: 20px;
  justify-content: center;
}
.poster {
  width: 300px;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  margin: 0;
  margin-bottom: 1rem;
}
.ratings-box {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 0rem 0 1rem 0;
  max-width: 100%;
  max-height: 100%;
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
.delete-button {
  background-color: #472fe3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 200;
  font-size: 0.8rem;
}

.delete-button:hover {
  background-color: #cc1f1a;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.modal-content input {
  padding: 0.5rem;
  font-size: 1rem;
}
.modal-content button {
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>

<!--TODO show platform-->