// client-utils.js
import { Toast } from './toast.js';  // Add this line at the top of the file

export async function fetchData(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export function showToast(message, type = 'info') {
  // Assuming you're using the Toast class from toast.js
  Toast.show(message, type);
}

export const CATEGORIES = [
  'Hearty Soups & Stews',
  'Autumn Pies & Desserts',
  'Harvest Casseroles',
  'Festive Breads & Rolls',
  'Spicy Chili Varieties'
];

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    showToast('Failed to save data locally', 'error');
  }
}

export function getFromLocalStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    showToast('Failed to retrieve local data', 'error');
    return null;
  }
}

export function showLoading(show = true) {
  const loadingElement = document.getElementById('loading-spinner');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

// Global error handlers
window.addEventListener('error', function(event) {
  console.error('Uncaught error:', event.error);
  showToast('An unexpected error occurred. Please try again or contact support.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('An unexpected error occurred. Please try again or contact support.', 'error');
});
