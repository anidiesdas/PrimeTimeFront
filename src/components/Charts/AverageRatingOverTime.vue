<template>
  <div class="all-wrapper">
    <h2>📈 Ratings over time...</h2>
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
const options = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        title(context) {
          const date = new Date(context[0].parsed.x)
          return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        label(context) {
          const point = context.raw
          return [`🎬 ${point.title}`, `⭐ Rating: ${point.y}`]
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
  1: '#ceb2f4',  2: '#5ca7ff', 3: '#4133c1',
  4: '#f4f47c',  5: '#abffb8', 6: '#ff5151', 7: '#4cb111',
  8: '#ffffff',  9: '#ff9740', 10: '#006771', 11: '#7a76d1',
  12: '#000000'
}

onMounted(async () => {
  const [moviesRes, membersRes] = await Promise.all([
    fetch(`${import.meta.env.VITE_API_URL}movie/completed`),
    fetch(`${import.meta.env.VITE_API_URL}members`)
  ])
  const [movies, members] = await Promise.all([moviesRes.json(), membersRes.json()])

  const ratingMap = {}

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

  const avgDataset = {
    label: 'Durchschnitt',
    data: sortedDates.map(date => {
      const avg = Number((ratingMap[date].total / ratingMap[date].count).toFixed(2))
      const entry = ratingMap[date].entries[0]
      return { x: date, y: avg, title: entry.title, movieId: entry.id }
    }).sort((a, b) => new Date(a.x) - new Date(b.x)),
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

  chartData.value.datasets = [avgDataset, ...memberDatasets]
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