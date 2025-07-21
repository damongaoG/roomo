import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import Menu from './components/Menu';
import Page from './pages/Page';
import SplashScreen from './pages/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import React, { useEffect } from 'react';

setupIonicReact();

const AppContent: React.FC = () => {
  const { isLocalAuthenticated, hasCompletedOnboarding } = useAuth();
  const { handleRedirectCallback } = useAuth0();

  // Handle deep links for Auth0 callbacks on mobile
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async event => {
        // Check if the URL is an Auth0 callback
        if (event.url && event.url.includes('auth0callback')) {
          try {
            // Extract the callback parameters from the URL
            const url = new URL(event.url);
            const searchParams = url.searchParams;

            // Create a callback URL that Auth0 can process
            const callbackUrl = `${window.location.origin}${url.pathname}?${searchParams.toString()}`;

            // Handle the Auth0 callback
            await handleRedirectCallback(callbackUrl);
          } catch (error) {
            console.error('Error handling Auth0 callback:', error);
          }
        }
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [handleRedirectCallback]);

  // Show splash screen if not locally authenticated
  if (!isLocalAuthenticated) {
    return <SplashScreen />;
  }

  // Show onboarding screen
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  // Show main app
  return (
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Route path="/" exact={true}>
            <Redirect to="/folder/Inbox" />
          </Route>
          <Route path="/folder/:name" exact={true}>
            <Page />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </IonApp>
  );
};

export default App;
