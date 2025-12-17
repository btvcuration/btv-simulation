import { useState, useEffect } from 'react';
import { fetchMoviesAPI } from '../services/movieService';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMoviesAPI(); // 여기서 실제/가짜 여부는 신경 안 씀
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { movies, loading, error };
};
