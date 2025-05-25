import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/components/Home.vue'
import MovieSearch from '@/components/MovieSearch.vue'
import MovieList from "@/components/MovieList.vue";
import MovieDetails from "@/components/MovieDetails.vue";
import Dropped from "@/components/Dropped.vue";
import PlanToWatch from "@/components/PlanToWatch.vue";
import Completed from "@/components/Completed.vue";
import Statistics from "@/components/Statistics.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            { path: '', component: Home },
            { path: 'popular', component: MovieList },
            { path: 'search/:query', component: MovieSearch },
            { path: 'movie/:id', component: MovieDetails },
            { path: 'plantowatch', component: PlanToWatch },
            { path: 'completed', component: Completed },
            { path: 'dropped', component: Dropped },
            { path: 'statistics', component: Statistics },
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
