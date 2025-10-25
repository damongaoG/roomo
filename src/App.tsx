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

setupIonicReact();

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Redirect to="/looker/registration" />
  ) : (
    <Redirect to="/splash" />
  );
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

            {/* Splash and Onboarding */}
            <Route path="/splash" exact={true} component={SplashScreen} />
            <Route
              path="/onboarding"
              exact={true}
              component={OnboardingScreen}
            />

            {/* Looker registration flow */}
            <Route
              path="/looker/registration"
              exact={true}
              component={LookerRegistration}
            />
            <Route
              path="/looker/move-in-area"
              exact={true}
              component={LookerMoveInArea}
            />
            <Route
              path="/looker/move-in-date"
              exact={true}
              component={LookerMoveInDate}
            />

            {/*<Route path="/folder/:name" exact={true}>*/}
            {/*  <Page />*/}
            {/*</Route>*/}
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
