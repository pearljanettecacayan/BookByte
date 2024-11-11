import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteBooks = ref([]);
  const currentUserEmail = ref(localStorage.getItem('userEmail')); // Store email of the logged-in user

  // Function to load favorite books from localStorage for the current user
  const loadFavorites = () => {
    if (currentUserEmail.value) {
      const storedFavorites = localStorage.getItem(currentUserEmail.value);
      if (storedFavorites) {
        favoriteBooks.value = JSON.parse(storedFavorites);
      } else {
        favoriteBooks.value = []; // If no favorites exist for the user, start with an empty list
      }
    }
  };

  // Function to save favorite books to localStorage whenever they change
  const saveFavorites = () => {
    if (currentUserEmail.value) {
      localStorage.setItem(currentUserEmail.value, JSON.stringify(favoriteBooks.value));
    }
  };

  // Function to add a book to the favorites list
  const addFavorite = (book) => {
    if (!favoriteBooks.value.find((b) => b.title === book.title)) {
      favoriteBooks.value.push(book);
      saveFavorites();  // Save the updated list of favorite books to localStorage
    }
  };

  // Function to remove a book from the favorites list
  const removeFavorite = (bookId) => {
    favoriteBooks.value = favoriteBooks.value.filter((book) => book.id !== bookId);
    saveFavorites();  // Save the updated list after removal
  };

  // Watch for changes to the current user's email and load their favorites
  watchEffect(() => {
    if (currentUserEmail.value) {
      loadFavorites();
    } else {
      favoriteBooks.value = []; // If no user is logged in, reset the favorites list
    }
  });

  // Set the user and load their favorites
  const setUser = (email) => {
    currentUserEmail.value = email;
    localStorage.setItem('userEmail', email); // Store email in localStorage
    loadFavorites(); // Load the favorites for this user
  };

  return { favoriteBooks, addFavorite, removeFavorite, setUser };
});
