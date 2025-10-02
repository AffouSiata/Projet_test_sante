// Configuration centralisée de l'application
const config = {
  // API Configuration
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 secondes
  },

  // Application Configuration
  app: {
    name: 'Health App',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // Feature Flags (optionnel)
  features: {
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Storage Keys
  storage: {
    tokenKey: 'token',
    userKey: 'user',
  },
};

// Freeze config to prevent accidental modifications
export default Object.freeze(config);