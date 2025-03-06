import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Boxdle.css';
import styled from 'styled-components';

// API key for TMDB (in a real app, you'd store this in an environment variable)
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key

interface Movie {
  id: string;
  title: string;
  year: number | null;
  director?: string;
  cast?: string[];
  genres?: string[];
  runtime?: number;
  poster_url?: string;
}

interface Review {
  text: string;
  rating: number | null;
  reviewer: string;
  date: string;
  url: string;
  movieId: string;
}

interface LetterboxdData {
  movies: Movie[];
  reviews: Review[];
  metadata: {
    generated: string;
    count: number;
  };
}

interface MovieDetails {
  director: string;
  cast: string[];
  genres: string[];
  releaseYear: number | null;
  runtime: number | null;
  overview: string;
  posterUrl: string | null;
}

interface FallbackData {
  review: typeof DEFAULT_REVIEW;
  movie: Movie;
}

const DEFAULT_REVIEW: Review = {
  text: '',
  rating: null,
  reviewer: '',
  date: '',
  url: '',
  movieId: '',
};

const DEFAULT_MOVIE: Movie = {
  id: 'default',
  title: 'Default Movie',
  director: 'Unknown Director',
  cast: [],
  genres: [],
  runtime: undefined,
  poster_url: '',
  year: null,
};

const getFallbackData = (): FallbackData => {
  return {
    review: DEFAULT_REVIEW,
    movie: DEFAULT_MOVIE,
  };
};

const BoxdleContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #14181c;
  color: #fff;
`;

const Boxdle = () => {
  const [data, setData] = useState<LetterboxdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [guessInput, setGuessInput] = useState('');
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [maxAttempts] = useState(5);
  const [visibleHints, setVisibleHints] = useState<string[]>([]);
  const [alternateReview, setAlternateReview] = useState<Review | null>(null);

  // New state for movie details and hints
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/letterboxd_reviews.json`);
      const data = await response.json();
      
      // Filter out reviews without director or cast
      const validReviews = data.filter((review: any) => 
        review.movie?.director && review.movie?.cast && review.movie?.cast.length > 0
      );

      if (validReviews.length === 0) {
        console.warn('No reviews found with complete information. Using fallback data.');
        const fallbackData = getFallbackData();
        setCurrentReview(fallbackData.review);
        setCurrentMovie(fallbackData.movie);
      } else {
        const randomIndex = Math.floor(Math.random() * validReviews.length);
        setCurrentReview(validReviews[randomIndex].review);
        setCurrentMovie(validReviews[randomIndex].movie);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      const fallbackData = getFallbackData();
      setCurrentReview(fallbackData.review);
      setCurrentMovie(fallbackData.movie);
      setLoading(false);
    }
  };

  // Fetch data from the JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/letterboxd_reviews.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const jsonData: LetterboxdData = await response.json();
        setData(jsonData);
        
        // Filter out reviews that contain the movie title or don't have required information
        const validReviews = jsonData.reviews.filter(review => {
          const movie = jsonData.movies.find(m => m.id === review.movieId);
          if (!movie) return false;
          
          // Skip if movie doesn't have director or cast information
          if (!movie.director || !movie.cast || movie.cast.length === 0) {
            return false;
          }
          
          // Check if review text contains the movie title (case insensitive)
          const reviewLower = review.text.toLowerCase();
          const titleLower = movie.title.toLowerCase();
          
          // Also check for title without special characters (e.g., "Spider-Man" -> "spiderman")
          const simplifiedTitle = titleLower.replace(/[^a-z0-9]/g, '');
          
          return !reviewLower.includes(titleLower) && 
                 (simplifiedTitle.length <= 3 || !reviewLower.includes(simplifiedTitle));
        });
        
        if (validReviews.length > 0) {
          // Select a random review from the filtered list
          const randomIndex = Math.floor(Math.random() * validReviews.length);
          const selectedReview = validReviews[randomIndex];
          setCurrentReview(selectedReview);
          
          // Find the corresponding movie
          const movie = jsonData.movies.find(m => m.id === selectedReview.movieId);
          setCurrentMovie(movie || null);
          
          // Find an alternate review for the same movie by a different reviewer
          const otherReviews = jsonData.reviews.filter(r => 
            r.movieId === selectedReview.movieId && 
            r.reviewer !== selectedReview.reviewer
          );
          
          if (otherReviews.length > 0) {
            setAlternateReview(otherReviews[0]);
          }
          
          console.log(`Selected review for "${movie?.title}" that has complete information`);
        } else {
          console.warn('No reviews found with complete information. Using fallback data.');
          // Use fallback data if no valid reviews
          const fallbackData = getFallbackData();
          setCurrentReview(fallbackData.review);
          setCurrentMovie(fallbackData.movie);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading review data. Please try again later.');
        setLoading(false);
        
        // Use fallback data
        const fallbackData = getFallbackData();
        setCurrentReview(fallbackData.review);
        setCurrentMovie(fallbackData.movie);
      }
    };
    
    fetchData();
  }, []);

  // Fetch movie details from TMDB when a new movie is selected
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!currentMovie) return;
      
      setLoadingDetails(true);
      
      try {
        // First, search for the movie to get its TMDB ID
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(currentMovie.title)}${currentMovie.year ? `&year=${currentMovie.year}` : ''}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData.results && searchData.results.length > 0) {
          const tmdbId = searchData.results[0].id;
          
          // Then fetch detailed information
          const detailsUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          // Extract relevant information
          const director = detailsData.credits.crew.find((person: any) => person.job === 'Director')?.name || 'Unknown';
          const cast = detailsData.credits.cast.slice(0, 5).map((actor: any) => actor.name);
          const genres = detailsData.genres.map((genre: any) => genre.name);
          const releaseYear = detailsData.release_date ? parseInt(detailsData.release_date.split('-')[0]) : null;
          const runtime = detailsData.runtime || null;
          const overview = detailsData.overview || '';
          const posterUrl = detailsData.poster_path ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}` : null;
          
          setMovieDetails({
            director,
            cast,
            genres,
            releaseYear,
            runtime,
            overview,
            posterUrl
          });
          
          // Update the current movie with the TMDB ID
          setCurrentMovie(prev => prev ? { ...prev, tmdbId } : null);
        } else {
          console.warn(`No TMDB results found for ${currentMovie.title}`);
          // Set some basic details even if we can't find the movie
          setMovieDetails({
            director: 'Unknown',
            cast: [],
            genres: [],
            releaseYear: currentMovie.year,
            runtime: null,
            overview: '',
            posterUrl: null
          });
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        // Set fallback details
        setMovieDetails({
          director: 'Unknown',
          cast: [],
          genres: [],
          releaseYear: currentMovie.year,
          runtime: null,
          overview: '',
          posterUrl: null
        });
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchMovieDetails();
  }, [currentMovie]);

  // Update visible hints when attempts change
  useEffect(() => {
    // Define which hints to show based on number of attempts
    const updateHints = () => {
      const hints: string[] = [];
      
      if (attempts.length >= 1) {
        // After first attempt, show review date
        hints.push('date');
      }
      
      if (attempts.length >= 2) {
        // After second attempt, show lead actor
        hints.push('actor');
      }
      
      if (attempts.length >= 3) {
        // After third attempt, show director
        hints.push('director');
      }
      
      if (attempts.length >= 4) {
        // After fourth attempt, show another review
        hints.push('alternate');
      }
      
      setVisibleHints(hints);
    };
    
    updateHints();
  }, [attempts]);

  // Fuzzy search for autocomplete
  useEffect(() => {
    if (!data) return;
    
    if (guessInput.length > 1) {
      const filtered = data.movies.filter(movie => 
        movie.title.toLowerCase().includes(guessInput.toLowerCase())
      );
      setFilteredMovies(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [guessInput, data]);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessInput(e.target.value);
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMovie) return;
    
    if (guessInput.trim() === '') {
      // This is a skip
      setAttempts(prev => [...prev, "Skipped"]);
      
      // Check if we've used all attempts
      if (attempts.length >= maxAttempts - 1) {
        setGameState('lost');
      }
    } else {
      // This is a guess
      setAttempts(prev => [...prev, guessInput]);
      
      // Check if guess is correct (case insensitive)
      if (guessInput.toLowerCase() === currentMovie.title.toLowerCase()) {
        setGameState('won');
        // Don't update hints if the guess is correct
        return;
      } else if (attempts.length >= maxAttempts - 1) { // -1 because we're adding the current attempt
        setGameState('lost');
      }
    }
    
    // Reset input
    setGuessInput('');
    setShowAutocomplete(false);
  };

  const selectMovie = (movie: Movie) => {
    setGuessInput(movie.title);
    setShowAutocomplete(false);
  };

  const resetGame = () => {
    if (!data || !data.reviews.length) return;
    
    // Filter out reviews that contain the movie title or don't have required information
    const validReviews = data.reviews.filter(review => {
      const movie = data.movies.find(m => m.id === review.movieId);
      if (!movie) return false;
      
      // Skip if movie doesn't have director or cast information
      if (!movie.director || !movie.cast || movie.cast.length === 0) {
        return false;
      }
      
      const reviewLower = review.text.toLowerCase();
      const titleLower = movie.title.toLowerCase();
      const simplifiedTitle = titleLower.replace(/[^a-z0-9]/g, '');
      
      return !reviewLower.includes(titleLower) && 
             (simplifiedTitle.length <= 3 || !reviewLower.includes(simplifiedTitle));
    });
    
    if (validReviews.length > 0) {
      // Select a random review from the filtered list
      const randomIndex = Math.floor(Math.random() * validReviews.length);
      const selectedReview = validReviews[randomIndex];
      setCurrentReview(selectedReview);
      
      // Find the corresponding movie
      const movie = data.movies.find(m => m.id === selectedReview.movieId);
      setCurrentMovie(movie || null);
      
      // Find an alternate review for the same movie by a different reviewer
      const otherReviews = data.reviews.filter(r => 
        r.movieId === selectedReview.movieId && 
        r.reviewer !== selectedReview.reviewer
      );
      
      if (otherReviews.length > 0) {
        setAlternateReview(otherReviews[0]);
      } else {
        setAlternateReview(null);
      }
    } else {
      console.warn('No valid reviews found for reset. Using fallback data.');
      // Use fallback data if no valid reviews
      const fallbackData = getFallbackData();
      setCurrentReview(fallbackData.review);
      setCurrentMovie(fallbackData.movie);
      setAlternateReview(null);
    }
    
    // Reset game state
    setAttempts([]);
    setGuessInput('');
    setGameState('playing');
    setVisibleHints([]);
  };

  // Render star rating
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 === 0.5;
    
    return (
      <div className="star-rating">
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Render hints
  const renderHints = () => {
    if (!currentMovie || !currentReview || visibleHints.length === 0) return null;
    
    return (
      <div className="hints-container">
        <h3>Hints:</h3>
        <ul className="hints-list">
          {visibleHints.includes('date') && currentReview.date && (
            <li className="hint">
              <span className="hint-label">Review Date:</span> {formatDate(currentReview.date)}
            </li>
          )}
          
          {visibleHints.includes('actor') && currentMovie.cast && currentMovie.cast.length > 0 && (
            <li className="hint">
              <span className="hint-label">Lead Actor:</span> {currentMovie.cast[0]}
            </li>
          )}
          
          {visibleHints.includes('director') && currentMovie.director && (
            <li className="hint">
              <span className="hint-label">Director:</span> {currentMovie.director}
            </li>
          )}
          
          {visibleHints.includes('alternate') && (
            <li className="hint alternate-review">
              <span className="hint-label">Another Review:</span>
              {alternateReview ? (
                <div>
                  <p className="alternate-review-text">"{alternateReview.text}"</p>
                  <div className="alternate-reviewer">— {alternateReview.reviewer}</div>
                  <div className="alternate-rating">{renderStars(alternateReview.rating)}</div>
                </div>
              ) : (
                <p className="no-alternate">No one else in your group has reviewed this film recently.<br/> (Only have each person's last 50 reviews)</p>
              )}
            </li>
          )}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <BoxdleContainer>
        <div className="boxdle-container">
          <div className="boxdle-loading">
            <div className="loading-spinner"></div>
            <p>Loading Letterboxd reviews...</p>
          </div>
        </div>
      </BoxdleContainer>
    );
  }

  if (error) {
    return (
      <BoxdleContainer>
        <div className="boxdle-container">
          <div className="boxdle-error">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </BoxdleContainer>
    );
  }

  return (
    <BoxdleContainer>
      <div className="boxdle-container">
        <div className="boxdle-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1>Boxdle</h1>
          <p className="boxdle-tagline">Guess the movie from Letterboxd reviews</p>
        </div>
        
        <div className="boxdle-game">
          {currentReview && (
            <div className="review-card">
              <div className="review-text">"{currentReview.text}"</div>
              <div className="reviewer">— {currentReview.reviewer}</div>
              <div className="rating">
                {renderStars(currentReview.rating)}
              </div>
            </div>
          )}
          
          {/* Render hints */}
          {renderHints()}
          
          <div className="attempts-container">
            {attempts.map((attempt, index) => (
              <div key={index} className={`attempt ${attempt === "Skipped" ? "skipped" : ""}`}>
                {attempt}
              </div>
            ))}
            {Array(maxAttempts - attempts.length).fill(0).map((_, index) => (
              <div key={`empty-${index}`} className="attempt empty"></div>
            ))}
          </div>
          
          {gameState === 'playing' ? (
            <form onSubmit={handleGuessSubmit} className="guess-form">
              <div className="input-container">
                <input
                  type="text"
                  value={guessInput}
                  onChange={handleGuessChange}
                  placeholder="Guess the movie..."
                  className="guess-input"
                  autoComplete="off"
                />
                {showAutocomplete && (
                  <div className="autocomplete">
                    {filteredMovies.map(movie => (
                      <div 
                        key={movie.id} 
                        className="autocomplete-item"
                        onClick={() => selectMovie(movie)}
                      >
                        {movie.title} {movie.year ? `(${movie.year})` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className={`guess-button ${!guessInput.trim() ? 'skip-button' : ''}`}
              >
                {guessInput.trim() ? 'Guess' : 'Skip'}
              </button>
            </form>
          ) : gameState === 'won' ? (
            <div className="game-result won">
              <h2>You got it!</h2>
              <p>The movie was: {currentMovie?.title} {currentMovie?.year ? `(${currentMovie.year})` : ''}</p>
              <button onClick={resetGame} className="reset-button">Play Again</button>
            </div>
          ) : (
            <div className="game-result lost">
              <h2>Better luck next time!</h2>
              <p>The movie was: {currentMovie?.title} {currentMovie?.year ? `(${currentMovie.year})` : ''}</p>
              <button onClick={resetGame} className="reset-button">Play Again</button>
            </div>
          )}
        </div>
      </div>
    </BoxdleContainer>
  );
};

export default Boxdle; 