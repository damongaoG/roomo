import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
  IonSpinner,
  IonLoading,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { Suspense, useEffect, useMemo } from 'react';
import { loadingController } from '@ionic/core';

const SplashScreen = React.lazy(() => import('./pages/SplashScreen'));
const OnboardingScreen = React.lazy(() => import('./pages/OnboardingScreen'));
const LookerRegistration = React.lazy(
  () => import('./pages/LookerRegistration')
);

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
  selectUserRole,
  selectSearchPreferences,
} from './store/slices/sessionSlice';
const Home = React.lazy(() => import('./pages/Home'));

setupIonicReact();

const RootRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const hasStoredSession = useAppSelector(selectHasStoredSession);
  const profileExists = useAppSelector(selectProfileExists);
  const userRole = useAppSelector(selectUserRole);
  const searchPreferences = useAppSelector(selectSearchPreferences);
  const hasSearchPreferences = searchPreferences != null;
  const isLooker = userRole === 'looker';
  console.log('[Route] RootRedirect', {
    isAuthenticated,
    hasStoredSession,
    profileExists,
    userRole,
    hasSearchPreferences,
    loading,
  });
  // If we already have a session, never show splash/onboarding; go to next step immediately.
  if (hasStoredSession) {
    if (!profileExists) return <Redirect to="/folder/Inbox" />;
    if (isLooker && !hasSearchPreferences) {
      return <Redirect to="/looker/registration" />;
    }
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
  return (
    <IonReactRouter>
      <RouteChangeDismissor />
      <RoutesWithGuards />
    </IonReactRouter>
  );
};

const AppShell: React.FC = () => {
  const { profileSyncing } = useAuth();

  return (
    <>
      <IonLoading
        isOpen={profileSyncing}
        message="Loading..."
        spinner="crescent"
        translucent={false}
        backdropDismiss={false}
        keyboardClose={false}
      />
      <div style={{ display: profileSyncing ? 'none' : undefined }}>
        <AppContent />
      </div>
    </>
  );
};

const RoutesWithGuards: React.FC = () => {
  const { loading } = useAuth();
  const hasStoredSession = useAppSelector(selectHasStoredSession);
  const profileExists = useAppSelector(selectProfileExists);
  const userRole = useAppSelector(selectUserRole);
  const searchPreferences = useAppSelector(selectSearchPreferences);
  const hasSearchPreferences = searchPreferences != null;
  const isLooker = userRole === 'looker';
  const requiresLookerOnboarding =
    hasStoredSession && profileExists && isLooker && !hasSearchPreferences;
  const history = useHistory();
  const location = useLocation();

  const lookerOnboardingRoutes = useMemo(
    () =>
      new Set([
        '/looker/registration',
        '/looker/move-in-area',
        '/looker/move-in-date',
      ]),
    []
  );

  const publicOnlyRedirect = () => {
    if (!hasStoredSession) return null;
    if (!profileExists) return <Redirect to="/folder/Inbox" />;
    if (requiresLookerOnboarding) return <Redirect to="/looker/registration" />;
    return <Redirect to="/home" />;
  };

  const requireAuthRedirect = () =>
    !hasStoredSession ? <Redirect to="/splash" /> : null;

  const requireProfileRedirect = () => {
    if (!profileExists) return <Redirect to="/folder/Inbox" />;
    if (requiresLookerOnboarding) return <Redirect to="/looker/registration" />;
    return null;
  };

  useEffect(() => {
    console.log('[Route] AppContent state', {
      loading,
      hasStoredSession,
      profileExists,
      userRole,
      hasSearchPreferences,
      requiresLookerOnboarding,
    });
  }, [
    loading,
    hasStoredSession,
    profileExists,
    userRole,
    hasSearchPreferences,
    requiresLookerOnboarding,
  ]);

  useEffect(() => {
    const pathname = location.pathname;
    console.log('[Route] AppContent effect check', {
      pathname,
      loading,
      hasStoredSession,
      profileExists,
      isLooker,
      hasSearchPreferences,
      requiresLookerOnboarding,
    });
    if (loading) return;
    if (!hasStoredSession) return;
    if (!profileExists) return;
    if (requiresLookerOnboarding) {
      if (!lookerOnboardingRoutes.has(pathname)) {
        console.log('[Route] Enforcing looker registration', { pathname });
        history.replace('/looker/registration');
      }
      return;
    }
    if (pathname === '/folder/Inbox') {
      console.log('[Route] Redirecting Inbox to home', { pathname, userRole });
      history.replace('/home');
    }
  }, [
    history,
    location.pathname,
    loading,
    hasStoredSession,
    profileExists,
    requiresLookerOnboarding,
    isLooker,
    hasSearchPreferences,
    userRole,
    lookerOnboardingRoutes,
  ]);

  return (
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
              if (profileExists) {
                console.log(
                  '[Route] /folder/Inbox redirecting due to profileExists',
                  {
                    isLooker,
                    hasSearchPreferences,
                    requiresLookerOnboarding,
                  }
                );
                if (requiresLookerOnboarding) {
                  return <Redirect to="/looker/registration" />;
                }
                return <Redirect to="/home" />;
              }
              console.log('[Route] /folder/Inbox rendering Page');
              return <Page />;
            }}
          />

          {/* Auth-only */}
          <Route
            path="/looker/registration"
            exact={true}
            render={() => {
              const a = requireAuthRedirect();
              if (a) return a;
              if (!profileExists) {
                console.log('[Route] /looker/registration allowed: no profile');
                return <LookerRegistration />;
              }
              if (isLooker && !hasSearchPreferences) {
                console.log(
                  '[Route] /looker/registration allowed: looker missing search preferences'
                );
                return <LookerRegistration />;
              }
              console.log('[Route] /looker/registration redirecting away', {
                profileExists,
                isLooker,
                hasSearchPreferences,
              });
              return (
                <Redirect to={profileExists ? '/home' : '/folder/Inbox'} />
              );
            }}
          />
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
              if (!profileExists) return <Redirect to="/folder/Inbox" />;
              if (isLooker && !hasSearchPreferences) {
                console.log(
                  '[Route] /looker/move-in-area redirecting to registration'
                );
                return <Redirect to="/looker/registration" />;
              }
              return <Redirect to="/home" />;
            }}
          />
          <Route
            path="/looker/move-in-date"
            exact={true}
            render={() => {
              const a = requireAuthRedirect();
              if (a) return a;
              if (!profileExists) return <Redirect to="/folder/Inbox" />;
              if (isLooker && !hasSearchPreferences) {
                console.log(
                  '[Route] /looker/move-in-date redirecting to registration'
                );
                return <Redirect to="/looker/registration" />;
              }
              return <Redirect to="/home" />;
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
            render={({ location: loc }) => {
              const pathname = loc?.pathname ?? window.location.pathname;
              console.log('[Route] * catch-all', {
                loading,
                hasStoredSession,
                profileExists,
                userRole,
                hasSearchPreferences,
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

              // Authed but no profile: allow onboarding flow pages
              if (hasStoredSession && !profileExists) {
                if (
                  pathname === '/folder/Inbox' ||
                  lookerOnboardingRoutes.has(pathname)
                ) {
                  return null;
                }
                return <Redirect to="/folder/Inbox" />;
              }

              if (requiresLookerOnboarding) {
                if (pathname === '/looker/registration') {
                  return null;
                }
                if (lookerOnboardingRoutes.has(pathname)) {
                  return <Redirect to="/looker/registration" />;
                }
                return <Redirect to="/looker/registration" />;
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
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </IonApp>
  );
};

export default App;
