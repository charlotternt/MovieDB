import axios from 'axios';

const API_KEY = '0b46f03332edaf31555e45bd076552e5';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'fr-FR',
  },
});

export const getUpcomingMovies = async () => {
  const response = await tmdb.get('/movie/upcoming');
  return response.data.results;
};