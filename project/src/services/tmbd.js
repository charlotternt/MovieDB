import axios from 'axios';

const API_KEY = '0b46f03332edaf31555e45bd076552e5';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getUpcomingMovies = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let movies = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
        params: {
          api_key: API_KEY,
          language: 'fr-FR',
          page: currentPage,
        },
      });

      if (response.data.results) {
        const filteredMovies = response.data.results.filter(
          (movie) => new Date(movie.release_date) >= new Date(today)
        );

        movies = [...movies, ...filteredMovies];
      }

      totalPages = response.data.total_pages;
      currentPage++;
    } while (currentPage <= totalPages && movies.length < 12); 

    return movies.slice(0, 12);
  } catch (error) {
    console.error('Erreur lors de la récupération des films :', error);
    return [];
  }
};

getUpcomingMovies();