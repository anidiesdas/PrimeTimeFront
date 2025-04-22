import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/components/Home.vue'
import MovieSearch from '@/components/MovieSearch.vue'
import MovieList from "@/components/MovieList.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '', component: Home },
            { path: '/popular', component: MovieList},
            { path: 'search/:query', component: MovieSearch }
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
