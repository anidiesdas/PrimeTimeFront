<template>
  <div class="page-container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/popular">Trending</router-link>
        <a>Plan To Watch</a>
        <a>Dropped</a>
        <a>Completed</a>
        <a>Statistics</a>
      </div>
    </nav>

    <!-- Hauptbereich: links Inhalt, rechts Sidebar -->
    <div class="main-section">
      <div class="main-content">
        <router-view />
      </div>

      <!-- Sidebar (Suchleiste + Stats) -->
      <div class="sidebar">
        <input
            v-model="searchQuery"
            @keyup.enter="submitSearch"
            placeholder="Search..."
            class="search-input"
        />
        <p2><strong>SDD Stats</strong></p2>
        <p2>Plan To Watch:</p2>
        <p2>Dropped:</p2>
        <p2>Completed:</p2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

const submitSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>
