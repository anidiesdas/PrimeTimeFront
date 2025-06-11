<template>
  <div class="chart-wrapper">
    <h2>🙆‍♀️ Who has spent the most time here??</h2>
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
      '#6ede8a', '#34974d',
      '#186a2c', '#2557a5',
      '#42a5f5', '#90caf9', '#f6cbd2',
      '#e47d92', '#db5778',
      '#fc7d71', '#fbc000', '#fdd730', '#fce577',
    ],

    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
  }]
})

const memberMinutes = ref({})

const options = {
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
    },
    y: {
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
          const memberName = context.label
          const movieCount = context.raw
          const totalMinutes = memberMinutes.value[memberName] ?? 0

          const days = Math.floor(totalMinutes / (24 * 60))
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
          const minutes = totalMinutes % 60

          let timeString = ''
          if (days > 0) timeString += `${days}d `
          if (hours > 0) timeString += `${hours}h `
          if (minutes > 0) timeString += `${minutes}min`

          return `${memberName}: ${movieCount} Movies 🎬 ${timeString.trim()}`
        }
      }
    }
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}members/watched-counts`)
    const memberStats = await res.json()

    const sortedMembers = memberStats.sort((a, b) => b.totalWatchedMovies - a.totalWatchedMovies)

    chartData.value.labels = sortedMembers.map(member => member.memberName)
    chartData.value.datasets[0].data = sortedMembers.map(member => member.totalWatchedMovies)

    const minutes = {}
    sortedMembers.forEach(member => {
      minutes[member.memberName] = member.totalWatchedMinutes
    })
    memberMinutes.value = minutes

  } catch (err) {
    console.error("Fehler beim Laden der Member-Statistiken:", err)
  }
})
</script>

<style scoped>
.chart-wrapper {
  background-color: rgba(255, 255, 255, 0.07);
  width: 90%;
  height: 550px;
  margin: 2rem auto;
  padding: 2rem 3rem 2rem 1rem;
  border-radius: 12px;
}

.chart-wrapper h2 {
  margin: 0 0 1rem 1rem;
}
</style>