<template>
  <div class="movie-list">
    <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUpcomingMovies } from '../services/tmbd';
import MovieCard from './MovieCard.vue';

export default {
  components: { MovieCard },
  setup() {
    const movies = ref([]);

    onMounted(async () => {
      movies.value = await getUpcomingMovies();
    });

    return { movies };
  },
};
</script>

<style>
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>