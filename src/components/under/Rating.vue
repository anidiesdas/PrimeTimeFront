<template>
  <div class="form-box">

    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <input type="password" v-model="enteredPassword" placeholder="Enter password" />
        <button @click="confirmPassword">OK</button>
        <button @click="cancelPassword">Cancel</button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-controls">
        <select v-model="selectedStatus">
          <option disabled value="">Watchlist Status</option>
          <option value="PLAN_TO_WATCH">Plan To Watch</option>
          <option value="DROPPED">Dropped</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <input type="date" v-model="selectedDate" class="date-picker" />
      </div>

      <div v-if="notification.message" :class="['notification-box', notification.type]">
        {{ notification.message }}
      </div>

      <button class="save-button" @click="saveData">Save</button>
    </div>

    <div
        v-if="['DROPPED', 'COMPLETED'].includes(selectedStatus)"
        class="user-select-container"
    >
      <button class="add-button" @click="toggleDropdown">👶</button>

      <div v-if="showDropdown" class="memberCheck">
        <label v-for="user in allUsers" :key="user.id">
          <input type="checkbox" :value="user" v-model="selectedUsers" />
          {{ user.name }}
        </label>
      </div>
    </div>

    <div class="user-container">
      <div v-for="user in selectedUsers" :key="user.id" class="user">
        <span class="user-name">{{ user.name }}</span>

        <input
            v-if="selectedStatus === 'COMPLETED'"
            type="number"
            v-model.number="ratingsByUser[user.id]"
            class="rating-input"
            placeholder="0–10"
            min="0"
            max="10"
        />
      </div>
    </div>

    <div class="tag-input-section">
      <input
          type="text"
          v-model="newTag"
          @keydown.enter.prevent="addTag"
          placeholder="Enter tags here..."
          class="tag-input"
      />

      <select v-model="selectedPlatform" class="platform-dropdown">
        <option disabled value="">Plattform wählen</option>
        <option
            v-for="platform in platforms"
            :key="platform.value"
            :value="platform.value" >
          {{ platform.label }}
        </option>
      </select>

      <div class="tag-list">
      <span
          v-for="(tag, index) in tags"
          :key="index"
          class="tag-pill"
      >
        {{ tag }}
        <button class="remove-tag" @click="removeTag(index)">×</button>
      </span>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedStatus: '',
      selectedDate: '',
      showDropdown: false,
      allUsers: [],
      selectedUsers: [],
      ratingsByUser: {},
      newTag: '',
      tags: [],
      selectedPlatform: '',
      platforms: [
        {value: 'NETFLIX', label: 'Netflix'},
        {value: 'PRIME_VIDEO', label: 'Prime Video'},
        {value: 'DISNEY_PLUS', label: 'Disney+'},
        {value: 'BLURAY_DVD', label: 'Blu-ray/DVD'},
        {value: 'YOUTUBE', label: 'YouTube'},
        {value: 'PARAMOUNT_PLUS', label: 'Paramount+'},
        {value: 'ARTE_MEDIATHEK', label: 'Arte Mediathek'},
        {value: 'UCI_KINO', label: 'UCI'},
        {value: 'CINESTAR', label: 'Cinestar'},
        {value: 'RTL_PLUS', label: 'RTL+'},
        {value: 'OTHER', label: 'Other'},
      ],
      notification: {message: '', type: ''},
      showPasswordModal: false,
      enteredPassword: '',
      passwordCallback: null,
    }
  },
  props: {
    movieId: Number,
    movieTitle: String,
    movieRuntime: Number,
    movieReleaseDate: String,
    movieGenres: Array
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      fetch(`${import.meta.env.VITE_API_URL}members`)
          .then(response => response.json())
          .then(data => {
            this.allUsers = data;
          })
          .catch(error => {
            console.error('Error', error);
          });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    getRatingFor(userId) {
      return this.ratingsByUser[userId] || 0;
    },
    addTag() {
      const trimmed = this.newTag.trim();
      if (trimmed && !this.tags.includes(trimmed)) {
        this.tags.push(trimmed);
      }
      this.newTag = '';
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    requestPassword(callback) {
      this.passwordCallback = callback;
      this.showPasswordModal = true;
    },
    confirmPassword() {
      this.showPasswordModal = false;
      this.passwordCallback(this.enteredPassword);
      this.enteredPassword = '';
    },
    cancelPassword() {
      this.showPasswordModal = false;
      this.passwordCallback(null);
      this.enteredPassword = '';
    },
    isValid() {
      // status muss ausgewählt sein
      if (!this.selectedStatus) {
        this.notification.message = 'select a status';
        this.notification.type = 'error';
        return false;
      }

      // dropped/completed: datum & plattform erforderlich
      if (['DROPPED', 'COMPLETED'].includes(this.selectedStatus)) {
        if (!this.selectedDate || !this.selectedPlatform) {
          this.notification.message = 'select date and platform grrr';
          this.notification.type = 'error';
          return false;
        }
      }

      // dropped/completed: mind 1. member
      if (['DROPPED', 'COMPLETED'].includes(this.selectedStatus) && this.selectedUsers.length === 0) {
        this.notification.message = "was there no one watching???";
        this.notification.type = 'error';
        return false;
      }

      // completed: bewertung für alle
      if (this.selectedStatus === 'COMPLETED') {
        const hasMissingRatings = this.selectedUsers.some(user => {
          const rating = this.ratingsByUser[user.id];
          return rating === undefined || rating === null || isNaN(rating) || rating < 0 || rating > 10;
        });

        if (hasMissingRatings) {
          this.notification.message = "a rating is missing:(";
          this.notification.type = 'error';
          return false;
        }
      }

      return true;
    },
    async saveData() {
      if (!this.isValid()) {
        return;
      }

      if (['DROPPED', 'COMPLETED'].includes(this.selectedStatus)) {
        this.requestPassword(async (password) => {
          if (!password) {
            this.notification.message = "Saving canceled";
            this.notification.type = 'error';
            return;
          }
          await this.sendMovieData(password);
        });
        return;
      }
      await this.sendMovieData(null);
    },
    async sendMovieData(password) {
      let ratings = [];

      if (this.selectedStatus === 'COMPLETED') {
        ratings = this.selectedUsers.map(user => ({
          memberId: user.id,
          rating: Number(this.getRatingFor(user.id)) || 0
        }));
      } else if (this.selectedStatus === 'DROPPED') {
        ratings = this.selectedUsers.map(user => ({
          memberId: user.id,
          rating: null
        }));
      }

      const payload = {
        movie: {
          id: this.movieId,
          title: this.movieTitle,
          runningTime: this.movieRuntime,
          releaseDate: this.movieReleaseDate,
          genres: this.movieGenres.map(g => typeof g === 'string' ? g : g.name),
          status: this.selectedStatus,
          watchDate: this.selectedDate || null,
          platform: this.selectedPlatform || null,
          tags: this.tags,
        },
        ratings: this.selectedStatus === 'PLAN_TO_WATCH' ? [] : ratings,
        password: password,
      };

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}movie/saving`, payload);

        if (response.data === 'INVALID_PASSWORD') {
          this.notification.message = 'Invalid password:(';
          this.notification.type = 'error';
          return;
        }

        this.notification.message = 'Movie saved:))';
        this.notification.type = 'success';

      } catch (err) {
        this.notification.message = (err.response?.data || err.message);
        this.notification.type = 'error';
      }
    }
  },
  watch: {
    selectedStatus(newStatus) {
      if (newStatus === 'PLAN_TO_WATCH') {
        this.selectedUsers = [];
        this.showDropdown = false;
        this.ratingsByUser = {};
      }
    }
  },
};
</script>


<style scoped>
.form-box {
  border: 1px solid rgba(204, 204, 204, 0.23);
  border-radius: 8px;
  padding: 1.3rem 1.3rem 1rem 1.3rem;
  background-color: rgba(255, 255, 255, 0.13);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  font-family: 'Rubik';
  margin: 2rem 0 1rem 0;
}
.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.status-controls {
  display: flex;
  align-items: center;
}
.status-row select,
.status-row .date-picker {
  width: 150px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  margin-right: 1rem;
}

.user-select-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.add-button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  text-align: center;
  margin: 0 0.5rem 0 0;
}
.memberCheck {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 8px 10px;
  margin: 3px 0 0rem 0.5rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 550px;
  box-sizing: border-box;
  color: #1f1f1f;
}
.user-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
}
.user {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 999px;
  background-color: #415a77;
}
.user-name {
  font-family: "Special Gothic Expanded One";
  font-size: 14px;
}
.rating-input {
  margin-left: 5px;
  width: 40px;
  border: none;
  border-radius: 4px;
  padding: 2px 4px;
  text-align: center;
  font-size: 0.9rem;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.tag-input-section {
}

.tag-input {
  width: 200px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-pill {
  background-color: #7c5c88;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "Special Gothic Expanded One";
}
.remove-tag {
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #ffffff;
  cursor: pointer;
  margin-left: 4px;
}
.platform-dropdown {
  width: 150px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  margin-left: 1rem;
}
.save-button {
  background-color: #d884cb;
  border: black;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  width: 5rem;
}
.notification-box {
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 500px;
  text-align: right;
}
.notification-box.success {
  color: #50ff78;
}
.notification-box.error {
  color: #ff5252;
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