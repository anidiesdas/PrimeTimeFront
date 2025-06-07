<template>
  <div class="status-summary">
    <div class="bar">
      <div
          v-for="status in statusList"
          :key="status.name"
          class="bar-segment"
          :style="{ width: getPercentage(status.count) + '%', backgroundColor: status.color }"
      ></div>
    </div>
    <ul class="status-labels">
      <li v-for="status in statusList" :key="status.name">
        <span class="dot" :style="{ backgroundColor: status.color }"></span>
        {{ status.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statusCounts = ref({})
const total = ref(0)

const statusList = ref([
  { name: 'DROPPED', count: 0, color: '#8da9c4' },
  { name: 'PLAN_TO_WATCH', count: 0, color: '#134074' },
  { name: 'COMPLETED', count: 0, color: '#c7f9cc' },
])

const fetchData = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}movie/status-counts`)
  const data = await res.json()
  statusCounts.value = data
  total.value = Object.values(data).reduce((sum, count) => sum + count, 0)

  statusList.value.forEach(status => {
    status.count = data[status.name] || 0
  })
}

const getPercentage = (count) => {
  return total.value ? (count / total.value) * 100 : 0
}

onMounted(fetchData)
</script>

<style scoped>
.status-summary {
  width: 1000px;
  margin: 2rem 1rem 2rem;
}

.bar {
  display: flex;
  width: 100%;
  max-width: 900px;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ccc;
  margin-bottom: 1rem;
}

.bar-segment {
  height: 100%;
}

.status-labels {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1.5rem;
}

.status-labels li {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  margin-right: 3rem;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
