import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Capacitor } from '@capacitor/core';
import { SecureTokenCache } from './utils/secureStorage';
import { store, persistor } from './store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

// Auth0 configuration
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// Determine redirect URI based on platform
const getRedirectUri = (): string => {
  if (Capacitor.isNativePlatform()) {
    // Use custom URL scheme for mobile apps
    return 'com.roomo.app://auth0callback';
  } else {
    // Use web URL for browser
    return import.meta.env.VITE_AUTH0_REDIRECT_URI;
  }
};

const auth0RedirectUri = getRedirectUri();

// Create token cache
const secureCache = new SecureTokenCache();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: auth0RedirectUri,
            scope: 'openid profile email',
          }}
          cache={secureCache}
          cacheLocation={undefined}
          useRefreshTokens={true}
        >
          <App />
        </Auth0Provider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
