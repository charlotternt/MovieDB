<template>
  <div>
    <h1>Prochaines sorties de films</h1>
    <MovieList />
  </div>
</template>

<script>
import MovieList from './components/MovieList.vue';

export default {
  components: { MovieList },
};
</script>

<style>
body{
  text-align: center;
  background-color: #121212;
  color: #e0e0e0;
  margin: 0;
  padding: 0;
}

h1 {
  font-family: "Lacquer", system-ui;
  font-weight: 400;
  font-style: normal;
  color: #0C63CC;
}
</style>