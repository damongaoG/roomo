import {IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact,} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {Redirect, Route} from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import {AuthProvider, useAuth} from "./contexts/AuthContext";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import React from "react";

setupIonicReact();

const AppContent: React.FC = () => {
  const {isAuthenticated, hasCompletedOnboarding} = useAuth();

  // Show splash screen if not authenticated
  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  // Show onboarding screen if authenticated
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen/>;
  }

  // Show main app if authenticated
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
