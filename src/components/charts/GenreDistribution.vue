<template>
  <div class="chart-wrapper">
    <h2>😽 Genre Distribution</h2>
    <Bar v-if="chartData.labels.length" :data="chartData" :options="options" />
    <p v-else>Diagrammdaten werden geladen...</p>
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
    label: "Anzahl Filme",
    data: [],
    backgroundColor: [
      '#db5778', '#e47d92', '#eda4b2', '#f6cbd2',
      '#90caf9', '#42a5f5', '#1976d2', '#0d47a1',
      '#10385c', '#10451d', '#155d27', '#25a244',
      '#6ede8a', '#b9d29d', '#fce577', '#fdd730',
      '#fbc000', '#fc7d71'
    ],
    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
  }]
})

const genreAverages = ref({})

const options = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 10,
      bottom: 40
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#a0a0a0',
        font: {
          size: 14,
          family: 'Rubik'
        }
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: '#a0a0a0',
        font: {
          size: 12,
          family: 'Rubik'
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.63)',
      titleColor: 'white',
      bodyColor: '#f8f8f8',
      callbacks: {
        label(context) {
          const genre = context.label
          const count = context.raw
          const avg = genreAverages.value[genre] ?? "–"
          return `Ø: ${avg} ${genre} 🍕 ${count} Movies`
        }
      }
    }
  }
}
onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
    const movies = await res.json()

    const genreCounts = {}
    const genreRatingStats = {}

    movies.forEach(movie => {
      const genres = movie.genres || []
      const ratings = movie.ratings || []

      // Durchschnitt aller Bewertungen dieses Films berechnen
      const validRatings = ratings
          .map(r => r.rating)
          .filter(r => typeof r === 'number' && r > 0)

      if (!genres.length || !validRatings.length) return

      const avgMovieRating = validRatings.reduce((a, b) => a + b / validRatings.length, 0)

      genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1

        if (!genreRatingStats[genre]) {
          genreRatingStats[genre] = { total: 0, count: 0 }
        }
        genreRatingStats[genre].total += avgMovieRating
        genreRatingStats[genre].count++
      })
    })

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
    chartData.value.labels = sortedGenres.map(([genre]) => genre)
    chartData.value.datasets[0].data = sortedGenres.map(([genre]) => genreCounts[genre])

    // Berechne Durchschnitt und speichere separat für Tooltip
    const averages = {}
    sortedGenres.forEach(([genre]) => {
      const { total, count } = genreRatingStats[genre] || { total: 0, count: 0 }
      averages[genre] = count > 0 ? (total / count).toFixed(2) : "–"
    })

    genreAverages.value = averages
  } catch (err) {
    console.error("Fehler beim Laden der Filme:", err)
  }
})

</script>

<style scoped>
.chart-wrapper {
  background-color: rgba(255, 255, 255, 0.07);
  width: 100%;
  height: 460px;
  margin: 2rem auto;
  padding: 2rem 3rem 2rem 1rem;
  border-radius: 12px;
}

.chart-wrapper h2 {
  margin: 0 0 1rem 1rem;
}
</style>
