<template>
  <div class="dough-wrapper">
    <h2>🐀 Platform Distribution</h2>
      <Doughnut v-if="chartData.labels.length" :data="chartData" :options="options" />
      <p v-else>Diagrammdaten werden geladen…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const platformLabelMap = {
  NETFLIX: 'Netflix',
  PRIME_VIDEO: 'Prime Video',
  DISNEY_PLUS: 'Disney+',
  BLURAY_DVD: 'Blu-ray/DVD',
  YOUTUBE: 'YouTube',
  PARAMOUNT_PLUS: 'Paramount+',
  ARTE_MEDIATHEK: 'Arte Mediathek',
  UCI_KINO: 'UCI',
  CINESTAR: 'Cinestar',
  RTL_PLUS: 'RTL+',
  OTHER: 'Other',
}

const chartData = ref({
  labels: [],
  datasets: [{
    label: "Filme pro Plattform",
    data: [],
    backgroundColor: [
      '#fce577', '#db5778', '#eda4b2', '#f6cbd2',
      '#90caf9', '#42a5f5', '#0b5dae',
      '#155d27', '#25a244', '#6ede8a', '#b9d29d',
    ],
    borderWidth: 0,
  }]
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  radius: '100%',
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: '#a0a0a0',
        font: {
          size: 16,
          family: 'Rubik',
        },
      }
    },
    tooltip: {
      backgroundColor: '#2e2e2e',
      titleColor: 'white',
      bodyColor: '#f8f8f8',
      callbacks: {
        label(context) {
          return `${context.label}: ${context.raw} Filme`
        }
      }
    }
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
    const movies = await res.json()

    const platformCounts = {}

    movies.forEach(movie => {
      const platform = movie.platform
      if (platform) {
        platformCounts[platform] = (platformCounts[platform] || 0) + 1
      }
    })

    const sortedPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])

    chartData.value.labels = sortedPlatforms.map(([platform]) => platformLabelMap[platform] || platform)
    chartData.value.datasets[0].data = sortedPlatforms.map(([_, count]) => count)

  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error)
  }
})
</script>

<style scoped>
.dough-wrapper {
  background-color: rgba(255, 255, 255, 0.07);
  width: 695px;
  height: 300px;
  margin: 2rem auto;
  padding: 2rem 0 5rem 2rem;
  border-radius: 12px;
}
.dough-wrapper h2{
  margin: 0 0 1rem 0;
}
</style>
