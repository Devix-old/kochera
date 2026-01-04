'use client';

import { useState, useEffect } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load recipes for search functionality
    const loadRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        }
      } catch (error) {
        // Failed to load recipes
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  return <Header recipes={recipes} />;
}
