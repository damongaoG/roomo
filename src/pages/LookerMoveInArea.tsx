import React, { useCallback, useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './LookerRegistration.css';
import './LookerMoveInArea.css';
import { useAppDispatch, useAppSelector } from '../store';
import { setSuburb } from '../store/slices/registrationSlice';

const LOCATIONS = [
  'All of Melbourne',
  'Richmond',
  'Carlton',
  'Fitzroy',
  'Docklands',
  'Windsor',
  'Brunswick',
  'Monash',
  'St Kilda',
  'Clayton',
] as const;

type Location = (typeof LOCATIONS)[number];

const LookerMoveInArea: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const registration = useAppSelector(state => state.registration);
  const [selected, setSelected] = useState<Location | null>(null);

  useEffect(() => {
    const hasBudgetRange =
      registration.minBudgetPerWeek != null &&
      registration.maxBudgetPerWeek != null;

    if (!hasBudgetRange) {
      history.replace('/looker/registration');
    }
  }, [history, registration.maxBudgetPerWeek, registration.minBudgetPerWeek]);

  const handleSelect = useCallback((loc: Location) => {
    setSelected(prev => (prev === loc ? null : loc));
  }, []);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const isNextEnabled = selected != null;

  const handleNext = useCallback(() => {
    if (!isNextEnabled) return;
    dispatch(setSuburb(selected as string));
    history.push('/looker/move-in-date');
  }, [dispatch, history, isNextEnabled, selected]);

  return (
    <IonPage>
      <IonContent fullscreen className="looker-page">
        {/* Top brand + back */}
        <div className="looker-brand">
          <IonButton
            aria-label="Back"
            className="back-btn"
            fill="clear"
            onClick={handleBack}
          >
            <IonIcon icon={chevronBack} />
          </IonButton>
          <h1>ROOMO</h1>
        </div>

        {/* Chat bubble with avatar */}
        <div className="chat-interface">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img
                src="/assets/images/icons/jeny_blink.png"
                alt="Jenny"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="chat-bubble">
              <span>
                {
                  "If you select 'All of Melbourne' we can always narrow it down to a specific suburb later on."
                }
              </span>
              <img
                src="/assets/images/icons/chat-tail.svg"
                alt=""
                aria-hidden="true"
                className="chat-tail"
                decoding="async"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Main question */}
        <div className="main-question">
          <span>What areas of Melbourne are you looking to move into?</span>
        </div>

        {/* Subheading */}
        <div className="subheading">
          <span>Top locations right now</span>
        </div>

        {/* Locations */}
        <div className="locations-section">
          <div
            className="locations-grid"
            role="group"
            aria-label="Move-in area"
          >
            {LOCATIONS.map(loc => (
              <IonButton
                key={loc}
                className={`location-pill${selected === loc ? ' selected' : ''}`}
                aria-pressed={selected === loc}
                onClick={() => handleSelect(loc)}
                fill="solid"
              >
                {loc}
              </IonButton>
            ))}
          </div>
        </div>

        {/* Next button */}
        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="solid"
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

export default LookerMoveInArea;
