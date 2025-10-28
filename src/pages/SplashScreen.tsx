import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonPage, useIonRouter } from '@ionic/react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    // Start logo fade in immediately
    setShowLogo(true);

    // Start background fade in after 2 seconds
    const backgroundTimer = setTimeout(() => {
      setShowBackground(true);
    }, 1000);

    // Show title after 2.5 seconds
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 1500);

    // Show subtitle after 3 seconds
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 2000);

    // Show tagline after 3.5 seconds
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 2500);

    // Show login button after 4 seconds (after all animations)
    const buttonTimer = setTimeout(() => {
      setShowLoginButton(true);
    }, 3000);

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(taglineTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="splash-container">
          {/* Background image */}
          <div
            className={`background-image ${showBackground ? 'visible' : ''}`}
          >
            <img
              src="/assets/images/backgrounds/background-1.png"
              alt="Background"
              decoding="async"
            />
          </div>

          {/* Logo - always visible after initial fade in */}
          <div className={`logo-container ${showLogo ? 'visible' : ''}`}>
            <img
              src="/assets/images/logos/jenny-logo.png"
              alt="Jenny Logo"
              decoding="async"
            />
          </div>

          {/* Text content container */}
          <div className="text-content">
            {/* App title */}
            <h1 className={`app-title ${showTitle ? 'visible' : ''}`}>ROOMO</h1>

            {/* Subtitle */}
            <h2 className={`app-subtitle ${showSubtitle ? 'visible' : ''}`}>
              Finding Compatible Roommates
            </h2>

            {/* Tagline with gradient */}
            <div className={`app-tagline ${showTagline ? 'visible' : ''}`}>
              <span className="tagline-starts">Starts</span>
              <span className="tagline-now">Now</span>
            </div>
          </div>

          {/* Login button */}
          <div
            className={`login-button-container ${
              showLoginButton ? 'visible' : ''
            }`}
          >
            <IonButton
              expand="block"
              onClick={() => router.push('/onboarding', 'forward')}
              className="login-button"
            >
              Let's get started
              <img
                style={{ marginLeft: '8px' }}
                src="/assets/images/icons/Arrow.svg"
                alt="Right Arrow"
                decoding="async"
                loading="lazy"
              />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
