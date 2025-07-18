import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonPage} from "@ionic/react";
import {useAuth} from "../contexts/AuthContext";
import "./OnboardingScreen.css";

const OnboardingScreen: React.FC = () => {
    const [showTitle, setShowTitle] = useState(false);
    const [showFeature1, setShowFeature1] = useState(false);
    const [showFeature2, setShowFeature2] = useState(false);
    const [showFeature3, setShowFeature3] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const {completeOnboarding} = useAuth();

    useEffect(() => {
        // Show title immediately
        setShowTitle(true);

        // Show features one by one
        const feature1Timer = setTimeout(() => setShowFeature1(true), 500);
        const feature2Timer = setTimeout(() => setShowFeature2(true), 1000);
        const feature3Timer = setTimeout(() => setShowFeature3(true), 1500);
        const buttonTimer = setTimeout(() => setShowButton(true), 2000);

        return () => {
            clearTimeout(feature1Timer);
            clearTimeout(feature2Timer);
            clearTimeout(feature3Timer);
            clearTimeout(buttonTimer);
        };
    }, []);

    const features = [
        {
            text: "No top spots, just fair visibility for all",
            show: showFeature1,
        },
        {
            text: "Every user is verified to avoid scams",
            show: showFeature2,
        },
        {
            text: "Message all users without paid walls",
            show: showFeature3,
        },
    ];

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
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-item ${feature.show ? "visible" : ""}`}
                            >
                                <img
                                    src="/assets/images/icons/tick_circle.svg"
                                    alt="Check"
                                    className="feature-icon"
                                />
                                <p className="feature-text">{feature.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Next button */}
                    <div
                        className={`onboarding-button-container ${
                            showButton ? "visible" : ""
                        }`}
                    >
                        <IonButton
                            expand="block"
                            onClick={completeOnboarding}
                            className="onboarding-button"
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
