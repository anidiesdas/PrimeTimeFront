<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>
    <div class="welcome-text">
      <h1>✅ Completed</h1>
    </div>
  </div>

  <div class="movie-list">
  <div class="top-bar">
      <div class="genre-filter">
        <button
            v-for="genre in availableGenres"
            :key="genre"
            :class="{ active: selectedGenres.includes(genre) }"
            @click="toggleGenre(genre)"
        >
          {{ getGenreEmoji(genre) }} {{ genre }}
        </button>
      </div>

    <div class="sort-buttons">
      <button
            :class="{ active: sortKey === 'releaseDate' }"
            @click="setSort('releaseDate')"
        >
          Sort by: 📅 Release Date
        </button>

        <button @click="toggleTags">
          🥸 Toggle Tags 🥸
        </button>

        <button
            :class="{ active: showPlatformFilters }"
            @click="showPlatformFilters = !showPlatformFilters"
        >
          👹 {{ showPlatformFilters ? '' : '' }}
        </button>

        <div class="platform-filter" v-if="showPlatformFilters">
          <label v-for="p in platforms" :key="p.label">
            <input
                type="checkbox"
                :value="p.values"
                :checked="p.values.every(v => selectedPlatformValues.includes(v))"
                @change="togglePlatformGroup(p.values)"
            />
            {{ p.label }}
          </label>
        </div>

      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>Nr.</th>
          <th @click="setSort('title')" :class="getSortClass('title')">Titel</th>
          <th @click="setSort('meanScore')" :class="getSortClass('meanScore')">👯‍♀️</th>
          <th
              v-for="member in visibleMembers"
              :key="member.id"
              @click="setSort(`member:${member.name}`)"
              :class="getSortClass(`member:${member.name}`)"
          >
            {{ member.name }}
          </th>
          <th @click="setSort('guestAverage')" :class="getSortClass('guestAverage')">guest</th>
          <th @click="setSort('genres')" :class="getSortClass('genres')">Genre</th>
          <th @click="setSort('watchDate')" :class="getSortClass('watchDate')">Watch Date</th>
          <th v-if="showTags" @click="setSort('tags')" :class="getSortClass('tags')">Tags</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(movie, index) in filteredAndSortedMovies" :key="movie.id">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="`/movie/${movie.id}`" class="movie-link">
              {{ movie.title }}
            </router-link>
          </td>
          <td>{{ movie.meanScore }}</td>
          <td v-for="member in visibleMembers" :key="member.id">
            {{ movie.ratings[member.name] ?? '-' }}
          </td>
          <td>{{ movie.guestAverage ?? '-' }}</td>
          <td>{{ movie.genres.join(', ') }}</td>
          <td>{{ movie.watchDate }}</td>
          <td v-if="showTags">{{ movie.tags?.join(', ') || '-' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getGenreEmoji, genreEmojiMap } from '@/utils/genreEmojis.js'

export default {
  name: 'CompletedTable',
  data() {
    return {
      availableGenres: Object.keys(genreEmojiMap),
      selectedGenres: [],
      selectedPlatformValues: [],
      platforms: [
        { values: ['NETFLIX'], label: 'Netflix' },
        { values: ['PRIME_VIDEO'], label: 'Prime Video' },
        { values: ['DISNEY_PLUS'], label: 'Disney+' },
        { values: ['BLURAY_DVD'], label: 'DVD' },
        { values: ['UCI_KINO', 'CINESTAR'], label: 'Kino' },
        { values: ['OTHER', 'YOUTUBE', 'RTL_PLUS', 'PARAMOUNT_PLUS', 'ARTE_MEDIATHEK'], label: 'Other+' },
      ],
      showPlatformFilters: false,
      completedMovies: [],
      members: [],
      sortKey: 'title',
      sortOrder: 'asc',
      showTags: false,
    };
  },
  computed: {
    visibleMembers() {
      return this.members.filter(m => m.id < 7);
    },
    formattedTable() {
      return this.completedMovies.map(movie => {
        const ratingsByMember = {};
        let total = 0;
        let count = 0;
        let guestTotal = 0;
        let guestCount = 0;

        this.members.forEach(member => {
          const entry = movie.ratings.find(r => r.memberId === member.id);
          const score = entry?.rating ?? null;

          if (member.id >= 7 && member.id <= 12) {
            if (score !== null) {
              guestTotal += score;
              guestCount++;
            }
          } else {
            ratingsByMember[member.name] = score;
            if (score !== null) {
              total += score;
              count++;
            }
          }
        });

        if (guestCount > 0) {
          total += guestTotal;
          count += guestCount;
        }

        return {
          ...movie,
          ratings: ratingsByMember,
          guestAverage: guestCount > 0 ? (guestTotal / guestCount).toFixed(1) : null,
          meanScore: count > 0 ? (total / count).toFixed(1) : '-',
        };
      });
    },
    filteredAndSortedMovies() {
      let result = this.formattedTable;

      if (this.selectedGenres.length > 0) {
        result = result.filter(movie =>
            this.selectedGenres.every(g => movie.genres.includes(g))
        );
      }

      if (this.selectedPlatformValues.length > 0) {
        result = result.filter(movie =>
            this.selectedPlatformValues.includes(movie.platform)
        );
      }

      result = [...result].sort((a, b) => {
        const key = this.sortKey;
        const parse = v => (v === null || v === undefined || v === '-' ? -1 : parseFloat(v));

        if (key === 'title' || key === 'genres' || key === 'tags') {
          const aVal = Array.isArray(a[key]) ? a[key].join(', ') : a[key];
          const bVal = Array.isArray(b[key]) ? b[key].join(', ') : b[key];
          return this.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        if (key === 'releaseDate' || key === 'watchDate') {
          const dateA = new Date(a[key]);
          const dateB = new Date(b[key]);
          return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (key === 'meanScore' || key === 'guestAverage') {
          return this.sortOrder === 'asc' ? parse(a[key]) - parse(b[key]) : parse(b[key]) - parse(a[key]);
        }

        if (key.startsWith('member:')) {
          const name = key.split(':')[1];
          return this.sortOrder === 'asc'
              ? parse(a.ratings[name]) - parse(b.ratings[name])
              : parse(b.ratings[name]) - parse(a.ratings[name]);
        }

        return 0;
      });

      return result;
    }
  },
  methods: {
    getGenreEmoji,
    toggleGenre(genre) {
      this.selectedGenres = this.selectedGenres.includes(genre)
          ? this.selectedGenres.filter(g => g !== genre)
          : [...this.selectedGenres, genre];
    },
    toggleTags() {
      this.showTags = !this.showTags;
    },
    setSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    getSortClass(key) {
      return {
        sortable: true,
        active: this.sortKey === key
      };
    },
    togglePlatformGroup(values) {
      const allSelected = values.every(v => this.selectedPlatformValues.includes(v));
      if (allSelected) {
        this.selectedPlatformValues = this.selectedPlatformValues.filter(v => !values.includes(v));
      } else {
        this.selectedPlatformValues = [...new Set([...this.selectedPlatformValues, ...values])];
      }
    }
  },
  mounted() {
    fetch(`${import.meta.env.VITE_API_URL}members`)
        .then(res => res.json())
        .then(data => {
          this.members = data;
        });

    fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
        .then(res => res.json())
        .then(data => {
          this.completedMovies = data;
        });

    this.selectedPlatformValues = this.platforms.flatMap(p => p.values);
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

.table-container {
    max-width: 100%;
    overflow-x: auto;
    font-family: 'Rubik', sans-serif;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.genre-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.genre-filter button {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #aaa;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
  color: white;
}

.genre-filter button.active {
  background: #d884cb;
  color: white;
  border-color: #d884cb;
}
.platform-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-left: 1.5rem;
}
.platform-filter label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ffffff;
  font-size: 0.85rem;
  cursor: pointer;
}
.platform-filter input[type="checkbox"] {
  transform: scale(1.2);
  accent-color: #ffffff;
}
.sort-buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
}
.sort-buttons button {
  height: 30px;
  background: rgba(82, 119, 156, 0.15);
  color: white;
  border: 1px solid #82b1a1;
}
.sort-buttons button.active {
  height: 30px;
  background: rgba(130, 177, 161, 0.35);
  color: white;
}
.table-container {
  max-width: 100%;
  max-height: 700px;
  overflow-y: auto;
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 900px;
}

th, td {
  border: 1px solid rgba(255, 255, 255, 0.46);
  padding: 0.5rem;
  text-align: center;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #1b263b;
  color: white;
  z-index: 1;
}

th.sortable {
  cursor: pointer;
}

th.active {
  background-color: #52779c;
}

.movie-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
}
</style>
