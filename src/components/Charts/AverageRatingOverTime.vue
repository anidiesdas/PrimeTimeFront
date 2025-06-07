<template>
  <div>
    <h2>⌛ Ratings over time...</h2>
    <div class="chart-wrapper">
    <Line v-if="chartData.labels.length" :data="chartData" :options="options" />
    <p v-else>Lade Diagrammdaten...</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale)

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Durchschnittliches Rating',
    data: [],
    borderColor: 'hotpink',// Farbe der Linie
    backgroundColor: 'pink', // Farbe der Punkte
    pointBackgroundColor: 'white', // Hintergrund der Punkte
    pointBorderColor: 'hotpink', // Randfarbe der Punkte
    borderWidth: 1, // Dicke der Linie
    pointRadius: 3, // Punktgröße
    pointHoverRadius: 7, // Punktgröße bei Hover
    tension: 0.3
  }]
})

const options = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        title(context) {
          const date = new Date(context[0].parsed.x)
          return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        },
        label(context) {
          const point = context.raw
          return [`🎬 ${point.title}`, `⭐ Rating: ${point.y}`]
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 10,
      title: { display: true, text: 'Rating' }
    },
    x: {
      type: 'time',
      time: {
        unit: 'month',
        displayFormats: {
          month: 'yyyy-MM'
        }
      },
      title: { display: true, text: 'Watch Date' },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  },
  onClick(event, elements, chart) {
    if (!elements.length) return
    const { datasetIndex, index } = elements[0]
    const dataPoint = chart.data.datasets[datasetIndex].data[index]
    if (dataPoint.movieId) {
      router.push(`/movie/${dataPoint.movieId}`)
    }
  }
})


onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
  const movies = await res.json()

  const ratingMap = {} // <-- FEHLTE

  movies.forEach(movie => {
    if (!movie.watchDate || !movie.ratings?.length) return

    const date = movie.watchDate
    const title = movie.title
    const ratings = movie.ratings.map(r => r.rating).filter(r => typeof r === 'number' && r > 0)

    if (!ratings.length) return

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length

    if (!ratingMap[date]) {
      ratingMap[date] = {
        total: avg,
        count: 1,
        entries: [{ id: movie.id, title }]
      }
    } else {
      ratingMap[date].total += avg
      ratingMap[date].count++
      ratingMap[date].entries.push({ id: movie.id, title })
    }
  })

  const sortedDates = Object.keys(ratingMap).sort((a, b) => new Date(a) - new Date(b))

  chartData.value.labels = sortedDates
  chartData.value.datasets[0].data = sortedDates.map(date => {
    const avg = Number((ratingMap[date].total / ratingMap[date].count).toFixed(2))
    const entry = ratingMap[date].entries[0] // z.B. erster Film des Datums
    return {
      x: date,
      y: avg,
      title: entry.title,
      movieId: entry.id
    }
  })
})
</script>

<style scoped>
.chart-wrapper {
  display: flex;
  width: 100%;
  height: 300px;
}
</style>