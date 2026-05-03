/**
 * Get the backend base URL for authentication routes
 * 
 * In development (localhost:5173):
 *   Returns: http://localhost:3000
 * 
 * In production (render.com or any deployed environment):
 *   Returns: Current origin (same domain as frontend)
 */
export function getBackendUrl() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development environment - use localhost:3000
    return 'http://localhost:3000';
  }
  
  // Production environment - use current origin
  // This works for render.com where both frontend and backend are served from the same domain
  return window.location.origin;
}

/**
 * Get the full path for an admin route
 * @param {string} path - The path (e.g., '/admin/login')
 * @returns {string} Full URL
 */
export function getAdminUrl(path) {
  return `${getBackendUrl()}${path}`;
}
