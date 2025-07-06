import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';

function App() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = async (movie) => {
    const exists = watchlist.find((m) => m.imdbID === movie.imdbID);
    if (!exists) {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=525c0cbf`);
        const fullDetails = await res.json();
        if (fullDetails.Response === 'True') {
          setWatchlist(prev => [...prev, fullDetails]);
        } else {
          console.error('OMDB error:', fullDetails.Error);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(prev => prev.filter((m) => m.imdbID !== id));
  };

  return (
    <BrowserRouter>
      <Navbar watchlistCount={watchlist.length} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              watchlist={watchlist}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
            />
          }
        />
        <Route
          path="/Watchlist"
          element={<Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
