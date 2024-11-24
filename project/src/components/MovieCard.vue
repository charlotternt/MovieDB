<template>
  <div class="movie-card" @click="goToDetails">
    <div class="image-container">
      <img 
        :src="posterUrl" 
        :alt="movie.title"
        @error="handleImageError"
        v-if="!imageError"
      />
      <div v-else class="fallback-image">
        <span>{{ movie.title[0] }}</span>
      </div>
    </div>
    <h3>{{ movie.title }}</h3>
    <p>Date de sortie : {{ formattedReleaseDate }}</p>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      imageError: false
    };
  },

  computed: {
    posterUrl() {
      return this.movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
        : null;
    },

    formattedReleaseDate() {
      if (!this.movie.release_date) return 'Date inconnue';
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(this.movie.release_date));
    }
  },

  methods: {
    goToDetails() {
      this.$router.push({
        name: 'movie-details',
        params: { id: this.movie.id }
      });
    },

    handleImageError() {
      this.imageError = true;
    }
  }
};
</script>

<style scoped>
.movie-card {
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 4px 4px 2px 1px #d7d7d7;
  background-color: #4e4e4e;
  cursor: pointer;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 5px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fallback-image {
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-image span {
  font-size: 2rem;
  color: white;
}

h3 {
  font-family: "Quicksand", serif;
  font-weight: 600;
  margin: 10px 0;
}

p {
  font-family: "Quicksand", serif;
  font-weight: 300;
}
</style>