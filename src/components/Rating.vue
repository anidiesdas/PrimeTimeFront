<template>
  <div class="form-box">
    <div class="status-row">
      <div class="status-controls">
        <select v-model="selectedStatus">
          <option disabled value="">Watchlist Status</option>
          <option value="plan">Plan To Watch</option>
          <option value="remove">Remove</option>
          <option value="dropped">Dropped</option>
          <option value="completed">Completed</option>
        </select>

        <input type="date" v-model="selectedDate" class="date-picker" />
      </div>

      <div v-if="notification.message" :class="['notification-box', notification.type]">
        {{ notification.message }}
      </div>

      <button class="save-button" @click="saveData">Save</button>
    </div>

    <div
        v-if="['dropped', 'completed'].includes(selectedStatus)"
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
            v-if="selectedStatus === 'completed'"
            type="text"
            v-model="userReviews[user.id]"
            class="rating-input"
            placeholder="0–10"
            @input="sanitizeInput(user.id)"
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
export default {
  data() {
    return {
      selectedStatus: '',
      selectedDate: '',
      showDropdown: false,
      allUsers: [], // wird jetzt dynamisch geladen
      selectedUsers: [],
      userReviews: {},
      newTag: '',
      tags: [],
    notification: { message: '', type: '' }
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      fetch('http://localhost:8080/members')
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
    sanitizeInput(userId) {
      let val = this.userReviews[userId];
      val = val.replace(/[^\d.]/g, '');
      let num = parseFloat(val);
      if (isNaN(num)) {
        this.userReviews[userId] = '';
      } else {
        if (num > 10) num = 10;
        if (num < 0) num = 0;
        this.userReviews[userId] = num.toString();
      }
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
    saveData() {
      this.notification.message = '';
      this.notification.type = '';

      const hasMissingRatings = this.selectedStatus === 'completed' &&
          this.selectedUsers.some(user => {
            const rating = this.userReviews[user.id];
            return rating === undefined || rating === '';
          });

      if (hasMissingRatings) {
        this.notification.message = 'Rating missing:(';
        this.notification.type = 'error';
        return;
      }

      this.notification.message = 'Movie saved:))';
      this.notification.type = 'success';

    }

  },
  watch: {
    selectedStatus(newStatus) {
      if (newStatus === 'plan') {
        this.selectedUsers = [];
        this.showDropdown = false;
        this.userReviews = {};
      }
    }
  }
};
</script>




<style scoped>
.form-box {
  border: 1px solid rgba(204, 204, 204, 0.23);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.13);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  font-family: 'Rubik';
  margin: 2rem 0 5rem 0;
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
  margin: 3px 0 0.5rem 0.5rem;
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
  color: #555;
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
}
.notification-box.success {
  color: #50ff78;
}
.notification-box.error {
  color: #ff5252;
}
</style>