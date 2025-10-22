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
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import Menu from './components/Menu';
import Page from './pages/Page';
import SplashScreen from './pages/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LookerRegistration from './pages/LookerRegistration';
import LookerMoveInArea from './pages/LookerMoveInArea';
import { useAppSelector } from './store';
import { selectLookerNeedsRegistration } from './store';

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
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const { handleRedirectCallback } = useAuth0();
  const lookerNeedsRegistration = useAppSelector(state =>
    selectLookerNeedsRegistration(state.auth)
  );

  // Handle deep links for Auth0 callbacks on mobile
  useEffect(() => {
    let remove: (() => void) | undefined;
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
        // Check if the URL is an Auth0 callback
        if (
          url.includes('state') &&
          (url.includes('code') || url.includes('error'))
        ) {
          await handleRedirectCallback(url);
        }
        // Close the browser after handling the callback
        await Browser.close();
      }).then(handle => {
        remove = () => handle.remove();
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (remove) {
        remove();
      }
    };
  }, [handleRedirectCallback]);

  // Show splash screen if not authenticated
  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  // LOOKER with empty registrationStep: force show LookerRegistration page
  if (lookerNeedsRegistration) {
    return (
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/looker/registration" exact={true}>
              <LookerRegistration />
            </Route>
            <Route path="/looker/move-in-area" exact={true}>
              <LookerMoveInArea />
            </Route>
            <Route path="/" exact={true}>
              <Redirect to="/looker/registration" />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    );
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
          <Route path="/looker/move-in-area" exact={true}>
            <LookerMoveInArea />
          </Route>
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
