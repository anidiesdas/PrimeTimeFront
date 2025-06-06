<template>
  <div>
    <h2 class="text-xl font-bold mb-2">⌛ Ratings over time...</h2>
    <Line v-if="chartData.labels.length" :data="chartData" :options="options" />
    <p v-else>Lade Diagrammdaten...</p>
  </div>
</template>

<script setup>
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
    backgroundColor: 'pink', // Farbe der Punkte (bzw. Fläche bei Flächendiagramm)
    pointBackgroundColor: 'white', // Hintergrund der Punkte
    pointBorderColor: 'hotpink', // Randfarbe der Punkte
    borderWidth: 1, // Dicke der Linie
    pointRadius: 3, // Punktgröße
    pointHoverRadius: 7, // Punktgröße bei Hover
    tension: 0.3
  }]
})

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: function(context) {
      const date = new Date(context[0].parsed.x)
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    tooltip: {
      callbacks: {
        title: function(context) {
          const date = new Date(context[0].parsed.x)
          return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        },
        label: function(context) {
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
  }
}


onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}movie/completed`)
  const movies = await res.json()

  const ratingMap = {}

  movies.forEach(movie => {
    if (!movie.watchDate || !movie.ratings?.length) return

    const date = movie.watchDate
    const title = movie.title
    const ratings = movie.ratings.map(r => r.rating).filter(r => typeof r === 'number' && r > 0)

    if (!ratings.length) return

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length

    if (!ratingMap[date]) {
      ratingMap[date] = { total: avg, count: 1, titles: [title] }
    } else {
      ratingMap[date].total += avg
      ratingMap[date].count++
      ratingMap[date].titles.push(title)
    }
  })

  const sortedDates = Object.keys(ratingMap).sort((a, b) => new Date(a) - new Date(b))

  chartData.value.labels = sortedDates
  chartData.value.datasets[0].data = sortedDates.map(date => ({
    x: date,
    y: Number((ratingMap[date].total / ratingMap[date].count).toFixed(2)),
    title: ratingMap[date].titles.join(', ')
  }))
})

</script>
