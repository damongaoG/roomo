import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
  IonSpinner,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { Suspense, useEffect } from 'react';
import { loadingController } from '@ionic/core';

const SplashScreen = React.lazy(() => import('./pages/SplashScreen'));
const OnboardingScreen = React.lazy(() => import('./pages/OnboardingScreen'));
const LookerRegistration = React.lazy(
  () => import('./pages/LookerRegistration')
);
const LookerMoveInArea = React.lazy(() => import('./pages/LookerMoveInArea'));
const LookerMoveInDate = React.lazy(() => import('./pages/LookerMoveInDate'));

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
import Page from './pages/Page';

setupIonicReact();

const RootRedirect: React.FC = () => {
  const { isAuthenticated, hasStoredSession, profileExists, loading } =
    useAuth();
  console.log('[Route] RootRedirect', {
    isAuthenticated,
    hasStoredSession,
    profileExists,
    loading,
  });
  // If we already have a session, never show splash/onboarding; go to next step immediately.
  if (hasStoredSession) {
    if (!profileExists) return <Redirect to="/folder/Inbox" />; // Page route
    return <Redirect to="/looker/registration" />;
  }
  // No session yet
  if (loading) return <SplashScreen />;
  return <Redirect to="/onboarding" />;
};

const RouteChangeDismissor: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    loadingController.dismiss().catch(() => {});
  }, [location.pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { loading, hasStoredSession, profileExists } = useAuth();
  return (
    <IonReactRouter>
      <RouteChangeDismissor />
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <IonSpinner name="crescent" />
              </div>
            }
          >
            {/* Entry decides by auth state */}
            <Route path="/" exact={true} render={() => <RootRedirect />} />

            {/* Splash with strict guard: if session exists, never show splash */}
            <Route
              path="/splash"
              exact={true}
              render={() => {
                console.log('[Route] /splash', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                if (hasStoredSession && profileExists)
                  return <Redirect to="/looker/registration" />;
                return <SplashScreen />;
              }}
            />
            <Route
              path="/onboarding"
              exact={true}
              render={() => {
                // Guard onboarding: if already logged in, send to proper next step
                console.log('[Route] /onboarding', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                if (hasStoredSession && profileExists)
                  return <Redirect to="/looker/registration" />;
                return <OnboardingScreen />;
              }}
            />

            {/* Looker registration flow */}
            <Route
              path="/looker/registration"
              exact={true}
              render={() => {
                console.log('[Route] /looker/registration', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (loading) return <SplashScreen />;
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                return <LookerRegistration />;
              }}
            />
            <Route
              path="/looker/move-in-area"
              exact={true}
              render={() => {
                console.log('[Route] /looker/move-in-area', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (loading) return <SplashScreen />;
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                return <LookerMoveInArea />;
              }}
            />
            <Route
              path="/looker/move-in-date"
              exact={true}
              render={() => {
                console.log('[Route] /looker/move-in-date', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (loading) return <SplashScreen />;
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                return <LookerMoveInDate />;
              }}
            />

            <Route path="/folder/:name" exact={true}>
              <Page />
            </Route>

            {/* Catch-all guard to prevent bypass */}
            <Route
              render={() => {
                console.log('[Route] * catch-all', {
                  loading,
                  hasStoredSession,
                  profileExists,
                });
                if (hasStoredSession && !profileExists)
                  return <Redirect to="/folder/Inbox" />;
                if (hasStoredSession && profileExists)
                  return <Redirect to="/looker/registration" />;
                if (loading) return <SplashScreen />;
                return <Redirect to="/onboarding" />;
              }}
            />
          </Suspense>
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
