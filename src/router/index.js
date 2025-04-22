import { createRouter, createWebHistory } from 'vue-router'
import MovieList from '../components/MovieList.vue'
import MovieSearch from '../components/MovieSearch.vue'
import Home from "@/components/Home.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/popular',
        name: 'Popular',
        component: MovieList
    },
    {
        path: '/search/:query',
        name: 'Search',
        component: MovieSearch,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
