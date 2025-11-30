// API Configuration
// Change this to your Vercel backend URL after deployment
const API_BASE_URL = 'https://eat-wise-silk.vercel.app/api';

// Helper function to get API base URL
function getApiBaseUrl() {
  // You can override this with an environment variable if needed
  return window.ENV?.API_URL || API_BASE_URL;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getApiBaseUrl };
}
