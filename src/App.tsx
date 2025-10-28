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
import { useAppSelector } from './store';
import {
  selectHasStoredSession,
  selectProfileExists,
} from './store/slices/sessionSlice';
const Home = React.lazy(() => import('./pages/Home'));

setupIonicReact();

const RootRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const hasStoredSession = useAppSelector(selectHasStoredSession);
  const profileExists = useAppSelector(selectProfileExists);
  console.log('[Route] RootRedirect', {
    isAuthenticated,
    hasStoredSession,
    profileExists,
    loading,
  });
  // If we already have a session, never show splash/onboarding; go to next step immediately.
  if (hasStoredSession) {
    if (!profileExists) return <Redirect to="/folder/Inbox" />;
    return <Redirect to="/home" />;
  }
  if (loading) return <SplashScreen />;
  return <Redirect to="/splash" />;
};

const RouteChangeDismissor: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    loadingController.dismiss().catch(() => {});
  }, [location.pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  const hasStoredSession = useAppSelector(selectHasStoredSession);
  const profileExists = useAppSelector(selectProfileExists);

  const publicOnlyRedirect = () =>
    hasStoredSession ? (
      <Redirect to={profileExists ? '/home' : '/folder/Inbox'} />
    ) : null;

  const requireAuthRedirect = () =>
    !hasStoredSession ? <Redirect to="/splash" /> : null;

  const requireProfileRedirect = () =>
    !profileExists ? <Redirect to="/folder/Inbox" /> : null;
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

            {/* Public pages */}
            <Route
              path="/splash"
              exact={true}
              render={() => {
                const gate = publicOnlyRedirect();
                if (gate) return gate;
                return <SplashScreen />;
              }}
            />
            <Route
              path="/onboarding"
              exact={true}
              render={() => {
                const gate = publicOnlyRedirect();
                if (gate) return gate;
                return <OnboardingScreen />;
              }}
            />
            {/* Auth-only */}
            <Route
              path="/folder/Inbox"
              exact={true}
              render={() => {
                const gate = requireAuthRedirect();
                if (gate) return gate;
                return <Page />;
              }}
            />

            {/* Auth + Profile required */}
            <Route
              path="/home"
              exact={true}
              render={() => {
                const a = requireAuthRedirect();
                if (a) return a;
                const b = requireProfileRedirect();
                if (b) return b;
                return <Home />;
              }}
            />
            <Route
              path="/looker/move-in-area"
              exact={true}
              render={() => {
                const a = requireAuthRedirect();
                if (a) return a;
                const b = requireProfileRedirect();
                if (b) return b;
                return <LookerMoveInArea />;
              }}
            />
            <Route
              path="/looker/move-in-date"
              exact={true}
              render={() => {
                const a = requireAuthRedirect();
                if (a) return a;
                const b = requireProfileRedirect();
                if (b) return b;
                return <LookerMoveInDate />;
              }}
            />
            {/* retain dynamic page when needed, require auth */}
            <Route
              path="/folder/:name"
              exact={true}
              render={() => {
                const a = requireAuthRedirect();
                if (a) return a;
                return <Page />;
              }}
            />

            {/* Catch-all guard to prevent bypass */}
            <Route
              path="*"
              render={({ location }) => {
                const pathname = location?.pathname ?? window.location.pathname;
                console.log('[Route] * catch-all', {
                  loading,
                  hasStoredSession,
                  profileExists,
                  pathname,
                });
                if (loading) return null;

                // Unauthed: allow only /splash and /onboarding here
                if (!hasStoredSession) {
                  if (pathname === '/splash' || pathname === '/onboarding') {
                    return null;
                  }
                  return <Redirect to="/splash" />;
                }

                // Authed but no profile: allow only /folder/Inbox
                if (hasStoredSession && !profileExists) {
                  if (pathname === '/folder/Inbox') {
                    return null;
                  }
                  return <Redirect to="/folder/Inbox" />;
                }

                // Authed and profiled: block public pages, otherwise allow
                if (pathname === '/splash' || pathname === '/onboarding') {
                  return <Redirect to="/home" />;
                }
                return null;
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
