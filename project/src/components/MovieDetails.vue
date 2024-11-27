<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
  </div>

  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
    <button @click="fetchMovieDetails" class="retry-button">Réessayer</button>
  </div>

  <div v-else-if="movie" class="movie-details">
    <div class="backdrop" :style="backdropStyle">
      <div class="overlay"></div>
    </div>
    
    <div class="content">
      <div class="poster-container">
        <img 
          v-if="movie.poster_path" 
          :src="posterUrl" 
          :alt="movie.title" 
          class="poster"
        />
      </div>

      <div class="info">
        <h1>{{ movie.title }}</h1>
        <div class="meta">
          <span class="release-date">{{ formattedReleaseDate }}</span>
          <span v-if="movie.runtime" class="runtime">{{ movie.runtime }} min</span>
          <span v-if="movie.vote_average" class="rating">
            ⭐ {{ movie.vote_average.toFixed(1) }}/10
          </span>
        </div>

        <div v-if="movie.genres" class="genres">
          <span v-for="genre in movie.genres" :key="genre.id" class="genre">
            {{ genre.name }}
          </span>
        </div>


        <div v-if="trailerKey" class="trailer-section">
          <h2>Bande-annonce</h2>
          <div class="video-container">
            <iframe 
              :src="`https://www.youtube.com/embed/${trailerKey}`" 
              title="Bande-annonce"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div v-if="movie.overview" class="overview">
          <h2>Synopsis</h2>
          <p>{{ movie.overview }}</p>
        </div>

        <div v-if="movie.credits?.cast" class="cast">
          <h2>Casting principal</h2>
          <div class="cast-list">
            <div v-for="actor in mainCast" :key="actor.id" class="cast-member">
              <img 
                v-if="actor.profile_path"
                :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`" 
                :alt="actor.name"
              />
              <div v-else class="actor-placeholder">
                <span>{{ actor.name[0] }}</span>
              </div>
              <p class="actor-name">{{ actor.name }}</p>
              <p class="character-name">{{ actor.character }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button @click="goBack" class="back-button">Retour</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMovieDetails } from '../services/tmbd';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const movie = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const posterUrl = computed(() => {
      return movie.value?.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
        : null;
    });

    const backdropStyle = computed(() => ({
      backgroundImage: movie.value?.backdrop_path
        ? `url(https://image.tmdb.org/t/p/original${movie.value.backdrop_path})`
        : 'none'
    }));

    const formattedReleaseDate = computed(() => {
      if (!movie.value?.release_date) return 'Date inconnue';
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(movie.value.release_date));
    });

    const mainCast = computed(() => {
      return movie.value?.credits?.cast?.slice(0, 5) || [];
    });

    const trailerKey = computed(() => {
      const videos = movie.value?.videos?.results || [];
      const trailerFr = videos.find(v => v.type === 'Trailer' && v.official && v.site === 'YouTube' && v.iso_639_1 === 'fr');
      const trailerEn = videos.find(v => v.type === 'Trailer' && v.official && v.site === 'YouTube' && v.iso_639_1 === 'en');
      
      return trailerFr?.key || trailerEn?.key;
    });

    const fetchMovieDetails = async () => {
      try {
        loading.value = true;
        error.value = null;
        movie.value = await getMovieDetails(route.params.id);
      } catch (err) {
        error.value = "Impossible de charger les détails du film";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push('/');
    };

    onMounted(fetchMovieDetails);

    return {
      movie,
      loading,
      error,
      posterUrl,
      backdropStyle,
      formattedReleaseDate,
      mainCast,
      trailerKey,
      fetchMovieDetails,
      goBack
    };
  }
};
</script>

<style scoped>
.trailer-section {
  margin-bottom: 30px;
}

.trailer-section h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-family: "Quicksand", serif;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.movie-details {
  position: relative;
  min-height: 100vh;
  color: white;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}

.poster-container {
  position: sticky;
  top: 40px;
}

.poster {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info {
  color: #fff;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-family: "Quicksand", serif;
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-family: "Quicksand", serif;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.genre {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.overview {
  margin-bottom: 40px;
}

.overview h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-family: "Quicksand", serif;
}

.cast h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: "Quicksand", serif;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.cast-member {
  text-align: center;
}

.cast-member img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
}

.actor-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 10px;
}

.actor-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.character-name {
  font-size: 0.9rem;
  color: #ccc;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Quicksand", serif;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }

  .poster-container {
    position: static;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>