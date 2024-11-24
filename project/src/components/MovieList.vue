<template>
  <div class="container">
    <h1 class="title">Prochaines Sorties</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des films...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchMovies" class="retry-button">Réessayer</button>
    </div>

    <!-- Movies grid -->
    <div v-else class="movie-list">
      <MovieCard 
        v-for="movie in movies" 
        :key="movie.id" 
        :movie="movie"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUpcomingMovies } from '../services/tmbd';
import MovieCard from './MovieCard.vue';

export default {
  name: 'MovieList',
  components: { MovieCard },

  setup() {
    const movies = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchMovies = async () => {
      try {
        loading.value = true;
        error.value = null;
        movies.value = await getUpcomingMovies();
      } catch (err) {
        error.value = "Une erreur est survenue lors du chargement des films.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchMovies);

    return {
      movies,
      loading,
      error,
      fetchMovies
    };
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-family: "Lacquer", system-ui;
  font-weight: 400;
  font-style: normal;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.retry-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-button:hover {
  background-color: #2980b9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>