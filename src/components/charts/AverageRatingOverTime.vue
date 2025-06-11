<template>
  <div class="all-wrapper">
    <h2>🧀 Ratings over time...</h2>
    <div class="chart-wrapper">
      <Line v-if="chartData.labels.length" :data="chartData" :options="options" />
      <p v-else>Lade Diagrammdaten...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const chartData = ref({ labels: [], datasets: [] })
const memberMap = {}

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
          return [
            `🎬 ${point.title}`,
            `🍿 Ø ${point.y}`,
          ]
        }
      }
    }
  },
  scales: {
    y: { min: 0, max: 10, title: { display: true, text: 'Rating' } },
    x: {
      type: 'time',
      time: { unit: 'month', displayFormats: { month: 'yyyy-MM' } },
      title: { display: true, text: 'Watch Date' },
      ticks: { maxRotation: 45, minRotation: 45 }
    }
  },
  onClick(event, elements, chart) {
    if (!elements.length) return
    const { datasetIndex, index } = elements[0]
    const dataPoint = chart.data.datasets[datasetIndex].data[index]
    if (dataPoint.movieId) router.push(`/movie/${dataPoint.movieId}`)
  }
})

const memberColors = {
  1: '#a685d3',  2: '#a9dfff', 3: '#0a3a78',  4: '#f4f47c',
  5: '#abffb8', 6: '#ff5151', 7: '#4cb111', 8: '#989898',
  9: '#ff9740', 10: '#ffffff', 11: '#fff202', 12: '#000000'
}

onMounted(async () => {
  const [moviesRes, membersRes, globalProgressRes] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}movie/completed`),
    fetch(`${import.meta.env.VITE_API_URL}members`),
    fetch(`${import.meta.env.VITE_API_URL}ratings/global-progress`)
  ])
  const [movies, members, globalProgress] = await Promise.all([
    moviesRes.json(), membersRes.json(), globalProgressRes.json()
  ])

  members.forEach(m => {
    memberMap[m.id] = m.name
  })

  const avgPoints = []
  movies.forEach(movie => {
    if (!movie.watchDate || !movie.ratings?.length) return

    const ratings = movie.ratings
        .map(r => parseFloat(r.rating))
        .filter(r => !isNaN(r) && r > 0)

    if (!ratings.length) return

    const avg = Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))

    avgPoints.push({
      x: movie.watchDate,
      y: avg,
      title: movie.title,
      movieId: movie.id,
      ratings: movie.ratings.map(r => ({
        memberId: r.memberId,
        rating: typeof r.rating === 'number' ? r.rating : parseFloat(r.rating)
      }))
    })
  })

  chartData.value.labels = avgPoints.map(p => p.x)

  const cumulativeDataset = {
    label: 'Avg',
    data: globalProgress.map(p => ({
      x: p.date,
      y: p.cumulativeAverage,
      title: `Daily: ${p.averageOfDay.toFixed(2)}`
    })),
    backgroundColor: '#56B4E9',
    pointBackgroundColor: 'white',
    pointBorderColor: '#56B4E9',
    borderColor: '#56B4E9',
    borderWidth: 1.5,
    pointRadius: 0.2,
    pointHoverRadius: 4,
    tension: 0.5,
    spanGaps: false
  }

  const avgDataset = {
    label: 'Daily Avg',
    data: avgPoints.sort((a, b) => new Date(a.x) - new Date(b.x)),
    backgroundColor: 'hotpink',
    pointBackgroundColor: 'hotpink',
    pointBorderColor: 'hotpink',
    borderColor: 'hotpink',
    borderWidth: 0,
    pointRadius: 2,
    pointHoverRadius: 7,
    spanGaps: false
  }

  const memberDatasets = members.map((member) => {
    const memberRatings = movies.flatMap(movie => {
      const rating = movie.ratings.find(r => r.memberId === member.id && r.rating > 0)
      if (!rating || !movie.watchDate) return []
      return [{
        x: movie.watchDate,
        y: rating.rating,
        title: movie.title,
        movieId: movie.id
      }]
    }).sort((a, b) => new Date(a.x) - new Date(b.x))

    return {
      label: member.name,
      data: memberRatings,
      backgroundColor: memberColors[member.id],
      pointBackgroundColor: memberColors[member.id],
      pointBorderColor: memberColors[member.id],
      borderColor: memberColors[member.id],
      hidden: true,
      borderWidth: 0,
      pointRadius: 2,
      pointHoverRadius: 7,
      spanGaps: false
    }
  })

  chartData.value.datasets = [cumulativeDataset, avgDataset, ...memberDatasets]
})
</script>

<style scoped>
.all-wrapper {
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  margin: 2rem 0;
  padding: 1rem 0;
}

.all-wrapper h2 {
  margin: 0.5rem 0.5rem 0.5rem 2rem;
}

.chart-wrapper {
  display: flex;
  width: 95%;
  height: 350px;
  margin: 0 auto;
}
</style>
