import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roomo.app',
  appName: 'roomo',
  webDir: 'dist',
  server: {
    hostname: 'localhost',
    iosScheme: 'capacitor',
  },
  plugins: {
    App: {
      appUrlOpen: {
        enabled: true,
      },
    },
  },
};

export default config;
