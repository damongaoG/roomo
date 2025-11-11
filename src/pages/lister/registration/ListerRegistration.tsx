import React, { useMemo, useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './ListerRegistration.css';

type AccommodationOption =
  | 'share-house'
  | 'whole-property'
  | 'homestay'
  | 'student-accommodation';

const optionCopy: Record<AccommodationOption, string> = {
  'share-house': 'Room(s) in an exciting share-house',
  'whole-property': 'Whole property for rent',
  homestay: 'Homestay',
  'student-accommodation': 'Student accommodation',
};

const ListerRegistration: React.FC = () => {
  const history = useHistory();
  const options = useMemo(
    () => Object.keys(optionCopy) as AccommodationOption[],
    []
  );
  const [selectedOption, setSelectedOption] =
    useState<AccommodationOption | null>(null);

  const handleNext = () => {
    if (!selectedOption) return;
    console.log('[ListerRegistration] next clicked', { selectedOption });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page">
        <div className="lister-brand">
          <IonButton
            aria-label="Back"
            className="back-btn"
            fill="clear"
            onClick={() => history.goBack()}
          >
            <IonIcon icon={chevronBack} />
          </IonButton>
          <h1>ROOMO</h1>
        </div>

        <div className="lister-chat">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img
                src="/assets/images/icons/jeny_blink.png"
                alt="Jenny avatar"
              />
            </div>
            <div className="chat-bubble">
              <span>This will help with finding roommates</span>
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

        <div className="lister-question">
          <h2>What type of accommodation are you offering?</h2>
        </div>

        <div className="options-grid" role="list">
          {options.map(option => (
            <IonButton
              key={option}
              fill="clear"
              className={`option-button${
                selectedOption === option ? ' selected' : ''
              }`}
              onClick={() => setSelectedOption(option)}
              role="listitem"
            >
              {optionCopy[option]}
            </IonButton>
          ))}
        </div>

        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="solid"
            className={`next-button${selectedOption ? ' enabled' : ''}`}
            disabled={!selectedOption}
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

export default ListerRegistration;
