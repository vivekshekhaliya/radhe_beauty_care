const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Common fetch utility for Radhe Beauty API calls
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}
