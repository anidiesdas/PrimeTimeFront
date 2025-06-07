<template>
  <div class="dough-wrapper">
    <h2>📊 Genre Distribution</h2>
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

const chartData = ref({
  labels: [],
  datasets: [{
    label: "",
    data: [],
    backgroundColor: [
      '#db5778', '#e47d92', '#eda4b2', '#f6cbd2',
      '#90caf9', '#42a5f5', '#1976d2', '#0d47a1',
      '#082a49', '#10451d', '#155d27', '#25a244',
      '#6ede8a', '#b9d29d', '#fce577', '#fdd730',
      '#fbc000', "#fc7d71"
    ],
    borderWidth: 0,
  }]
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
  },
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: 'white',
        font: {
          size: 16,
          family: 'Rubik'
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
  const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
  const movies = await res.json()

  const genreCounts = {}

  movies.forEach(movie => {
    const genres = movie.genres || []
    genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  chartData.value.labels = sortedGenres.map(([genre]) => genre)
  chartData.value.datasets[0].data = sortedGenres.map(([_, count]) => count)
})
</script>

<style scoped>
.dough-wrapper {
  background-color: rgba(255, 255, 255, 0.07);
  width: 695px;
  height: 300px;
  margin: 0 0 0 0;
  position: relative;
  padding: 2rem 0 4rem 2rem;
  border-width: 10px;
  border-radius: 12px;
}
.dough-wrapper h2{
  margin: 0 0 1rem 0;
}
</style>
