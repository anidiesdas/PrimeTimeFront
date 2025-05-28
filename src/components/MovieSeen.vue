<template>
  <div class="form-box">
    <div class="status-row">
      <div class="status-controls">
        <select v-model="selectedStatus">
          <option disabled value="">Watchlist Status</option>
          <option value="PLAN_TO_WATCH">Plan To Watch</option>
          <option value="DROPPED">Dropped</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div v-if="notification.message" :class="['notification-box', notification.type]">
        {{ notification.message }}
      </div>

      <button class="save-button" @click="updateData">Update</button>
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
      showDropdown: false,
      allUsers: [],
      selectedUsers: [],
      ratingsByUser: {},
      newTag: '',
      tags: [],
      notification: {message: '', type: ''}
    }
  },
  props: {
    movieId: Number,
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      fetch(`${import.meta.env.VITE_API_URL}members`)
          .then(async response => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Fehler vom Server: ${response.status} - ${errorText}`);
            } return response.json(); })
          .then(data => {
            this.allUsers = data;
          })
          .catch(error => {
            console.error("Fehler beim Laden der Nutzer:", error);
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
    updateData() {
      if (this.selectedUsers.length === 0) {
        this.notification.message = "Select a user grrr";
        this.notification.type = "error";
        return;
      }

      const password = prompt("Please enter the correct code to save");
      if (!password) {
        this.notification.message = 'Speichern abgebrochen: Kein Passwort eingegeben.';
        this.notification.type = 'error';
        return;
      }

      const correctPassword = '1210';

      const payload = {
        movieId: this.movieId,
        tags: this.tags,
        ratings: this.selectedUsers.map(user => ({
          movieId: this.movieId,
          memberId: user.id,
          rating: this.selectedStatus === 'COMPLETED'
              ? Number(this.getRatingFor(user.id)) || 0
              : null
        }))
      };

      axios.post(`${import.meta.env.VITE_API_URL}movie/update`, payload)
          .then(() => {
            this.notification.message = 'Movie updated:))';
            this.notification.type = 'success';
          })
          .catch(err => {
            console.error("Fehler:", err.response?.data || err.message);
            this.notification.message = "Error";
            this.notification.type = "error";
          });
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
.status-row select {
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
  margin: 3px 0 0 0.5rem;
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
.ratingdb {

}
</style>