import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import MovieList from './components/MovieList.vue';
import MovieDetails from './components/MovieDetails.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MovieList
    },
    {
      path: '/movie/:id',
      name: 'movie-details',
      component: MovieDetails,
      props: true 
    }
  ]
});

const app = createApp(App);
app.use(router);
app.mount('#app');