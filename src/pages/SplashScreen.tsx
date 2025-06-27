import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";
import "./SplashScreen.css";

const SplashScreen: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Start logo fade in immediately
    setShowLogo(true);

    // Start background fade in after 2 seconds
    const backgroundTimer = setTimeout(() => {
      setShowBackground(true);
    }, 2000);

    // Show login button after 4 seconds (after all animations)
    const buttonTimer = setTimeout(() => {
      setShowLoginButton(true);
    }, 4000);

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="splash-container">
          {/* Background image */}
          <div
            className={`background-image ${showBackground ? "visible" : ""}`}
          >
            <img
              src="/assets/images/backgrounds/background-1.png"
              alt="Background"
            />
          </div>

          {/* Logo - always visible after initial fade in */}
          <div className={`logo-container ${showLogo ? "visible" : ""}`}>
            <img src="/assets/images/logos/jenny-logo.png" alt="Jenny Logo" />
          </div>

          {/* Login button */}
          <div
            className={`login-button-container ${
              showLoginButton ? "visible" : ""
            }`}
          >
            <IonButton expand="block" onClick={login} className="login-button">
              Get Started
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
