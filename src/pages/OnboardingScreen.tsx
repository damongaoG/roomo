import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonPage} from "@ionic/react";
import {useAuth} from "../contexts/AuthContext";
import "./OnboardingScreen.css";

// Interface for feature items
interface FeatureItem {
  text: string;
  show: boolean;
  icon: string;
  altText: string;
  leftIcon?: string;
  leftAltText?: string;
}

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTitle, setShowTitle] = useState(false);
  const [showFeature1, setShowFeature1] = useState(false);
  const [showFeature2, setShowFeature2] = useState(false);
  const [showFeature3, setShowFeature3] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {completeOnboarding} = useAuth();

  // Reset animations when step changes
  useEffect(() => {
    // Only reset non-title animations
    setShowFeature1(false);
    setShowFeature2(false);
    setShowFeature3(false);
    setShowButton(false);

    // Start title animation
    if (currentStep === 1 && !showTitle) {
      const initTimer = setTimeout(() => {
        setShowTitle(true);
      }, 100);

      // Clear timeout on cleanup
      return () => {
        clearTimeout(initTimer);
      };
    }
  }, [currentStep, showTitle]);

  // Show features after step change
  useEffect(() => {
    if (!isTransitioning) {
      // Show features one by one
      const feature1Timer = setTimeout(() => setShowFeature1(true), 600);
      const feature2Timer = setTimeout(() => setShowFeature2(true), 1100);
      const feature3Timer = setTimeout(() => setShowFeature3(true), 1600);
      const buttonTimer = setTimeout(() => setShowButton(true), 2100);

      return () => {
        clearTimeout(feature1Timer);
        clearTimeout(feature2Timer);
        clearTimeout(feature3Timer);
        clearTimeout(buttonTimer);
      };
    }
  }, [currentStep, isTransitioning]);

  const featuresStep1: FeatureItem[] = [
    {
      text: "No top spots, just fair visibility for all",
      show: showFeature1,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
    },
    {
      text: "Every user is verified to avoid scams",
      show: showFeature2,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
    },
    {
      text: "Message all users without paid walls",
      show: showFeature3,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
    },
  ];

  const featuresStep2: FeatureItem[] = [
    {
      text: "Jenny follow ups",
      show: showFeature1,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
      leftIcon: "/assets/images/logos/jenny-logo.png",
      leftAltText: "Jenny",
    },
    {
      text: "Your very own Jenny companion",
      show: showFeature2,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
      leftIcon: "/assets/images/logos/jenny-logo.png",
      leftAltText: "Jenny",
    },
    {
      text: "No hidden fees or paid walls",
      show: showFeature3,
      icon: "/assets/images/icons/tick_circle.svg",
      altText: "Check",
    },
  ];

  // Select features based on current step
  const currentFeatures = currentStep === 1 ? featuresStep1 : featuresStep2;

  // Handle next button click
  const handleNext = () => {
    if (currentStep === 1) {
      // Start transitioning
      setIsTransitioning(true);

      // Hide current features and button
      setShowFeature1(false);
      setShowFeature2(false);
      setShowFeature3(false);
      setShowButton(false);

      setTimeout(() => {
        setCurrentStep(2);
        setIsTransitioning(false);
      }, 500);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="onboarding-container">
          {/* App title */}
          <h1 className={`onboarding-title ${showTitle ? "visible" : ""}`}>
            ROOMO
          </h1>

          {/* Features list */}
          <div className="features-list">
            {currentFeatures.map((feature, index) => (
              <div
                key={`${currentStep}-${index}`}
                className={`feature-item ${feature.show ? "visible" : ""} ${isTransitioning ? "fading-out" : ""}`}
              >
                {/* Left icon for Jenny features */}
                {feature.leftIcon && (
                  <img
                    src={feature.leftIcon}
                    alt={feature.leftAltText}
                    className="feature-icon-left"
                  />
                )}
                <p className="feature-text">{feature.text}</p>
                <img
                  src={feature.icon}
                  alt={feature.altText}
                  className="feature-icon"
                />
              </div>
            ))}
          </div>

          {/* Next button */}
          <div
            className={`onboarding-button-container ${
              showButton ? "visible" : ""
            } ${isTransitioning ? "fading-out" : ""}`}
          >
            <IonButton
              expand="block"
              onClick={handleNext}
              className="onboarding-button"
              disabled={isTransitioning}
            >
              Next
              <img
                style={{marginLeft: "8px"}}
                src="/assets/images/icons/Arrow.svg"
                alt="Right Arrow"
              />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingScreen;
