<template>
  <div class="bar-wrapper">
    <h2>🧀 Average Ratings by Genre</h2>
    <Bar v-if="chartData.labels.length" :data="chartData" :options="options" />
    <p v-else>Daten werden geladen…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Average Rating',
    data: [],
    count: [],
    backgroundColor: '#84d8ab',
    borderRadius: 8,
  }]
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 10,
      title: {
        display: true,
        text: 'Rating'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Genre'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const rating = ctx.raw.toFixed(2)
          const count = chartData.value.datasets[0].count[ctx.dataIndex] // 👈 Zugriff auf count
          return [`⭐ ${rating}`, `🎬 ${count} Filme`]
        }
      }
    }
  }
}

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
  const movies = await res.json()

  const genreStats = {}

  movies.forEach(movie => {
    if (!movie.genres || !movie.ratings?.length) return

    const avgRating = movie.ratings
        .map(r => r.rating)
        .filter(r => typeof r === 'number' && r > 0)
        .reduce((a, b, _, arr) => a + b / arr.length, 0)

    movie.genres.forEach(genre => {
      if (!genreStats[genre]) {
        genreStats[genre] = { total: 0, count: 0 }
      }
      genreStats[genre].total += avgRating
      genreStats[genre].count++
    })
  })

  const genreEntries = Object.entries(genreStats).map(([genre, stat]) => {
    return [genre, stat.total / stat.count]
  }).sort((a, b) => b[1] - a[1]) // nach Rating absteigend sortiert

  chartData.value.labels = genreEntries.map(([genre]) => genre)
  chartData.value.datasets[0].data = genreEntries.map(([_, rating]) => rating)
  chartData.value.datasets[0].count = genreEntries.map(([genre]) => genreStats[genre].count)
})
</script>

<style scoped>
.bar-wrapper {
  height: 350px;
  max-width: 900px;
  margin: 0 auto 2rem;
  padding: 1rem 2rem 4rem 2rem;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
}
.bar-wrapper h2 {
  margin: 0.5rem 0 0.5rem 0;
}
</style>
