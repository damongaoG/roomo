import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonRange,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import './LookerRegistration.css';

const LookerRegistration: React.FC = () => {
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [touched, setTouched] = useState(false);

  const isNextEnabled = useMemo(
    () => touched && maxBudget > 0,
    [touched, maxBudget]
  );

  const handleNext = () => {
    if (!isNextEnabled) return;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="looker-page">
        {/* Top brand + back */}
        <div className="looker-brand">
          <IonButton
            aria-label="Back"
            className="back-btn"
            fill="clear"
            onClick={() => window.history.back()}
          >
            <IonIcon icon={chevronBack} />
          </IonButton>
          <h1>ROOMO</h1>
        </div>

        {/* Chat bubble with avatar */}
        <div className="chat-interface">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img src="/assets/images/icons/jeny_blink.png" alt="Jenny" />
            </div>
            <div className="chat-bubble">
              <span>
                I can always change your budget preferences at a later date.
              </span>
            </div>
          </div>
        </div>

        {/* Main question */}
        <div className="main-question">
          <span>What’s your max budget per week?</span>
        </div>

        {/* Slider */}
        <div className="slider-section">
          <IonRange
            className="budget-range"
            min={0}
            max={2000}
            step={10}
            value={maxBudget}
            onIonInput={e => setMaxBudget(e.detail.value as number)}
            onIonChange={() => setTouched(true)}
          />

          <div className="range-labels">
            <div className="pill">Minimum</div>
            <div className="pill">Maximum</div>
          </div>
        </div>

        {/* Next button */}
        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="clear"
            className={`next-button${isNextEnabled ? ' enabled' : ''}`}
            disabled={!isNextEnabled}
            onClick={handleNext}
          >
            Next
            <IonIcon icon={arrowForward} slot="end" />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LookerRegistration;
