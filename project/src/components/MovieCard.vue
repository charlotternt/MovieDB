<template>
  <div class="movie-card">
    <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" :alt="movie.title" />
    <h3>{{ movie.title }}</h3>
    <p>Date de sortie : {{ formattedReleaseDate }}</p>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedReleaseDate() {
      if (!this.movie.release_date) return 'Date inconnue'; 
      const date = new Date(this.movie.release_date);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(date);
    },
  },
};
</script>

<style>
.movie-card {
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 4px 4px 2px 1px #d7d7d7;
  background-color: #4e4e4e;
}
img {
  width: 100%;
  border-radius: 5px;
}

h3{
  font-family: "Quicksand", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
}

p{
  font-family: "Quicksand", serif;
  font-optical-sizing: auto;
  font-weight: 300;
  font-style: normal;
}
</style>