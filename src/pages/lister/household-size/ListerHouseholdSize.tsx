import React, { useMemo } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerHouseholdSize.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectNumberOfPeopleLiving,
  setNumberOfPeopleLiving,
} from '../../../store/slices/listerPropertySlice';

const householdOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '5+', value: 6 },
] as const;

const ListerHouseholdSize: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const selectedPeople = useAppSelector(selectNumberOfPeopleLiving);

  const options = useMemo(() => householdOptions, []);
  const isNextEnabled = selectedPeople != null;

  const handleSelect = (value: number) => {
    dispatch(setNumberOfPeopleLiving(value));
  };

  const handleNext = () => {
    if (!isNextEnabled) return;
    if (selectedPeople != null) {
      dispatch(setNumberOfPeopleLiving(selectedPeople));
    }
    console.log('[ListerHouseholdSize] Next clicked', {
      number_of_people_living: selectedPeople,
    });
    history.push('/lister/room-details');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page household-size-page">
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
              <span>
                Include yourself when adding people that live in your home
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

        <div className="lister-question">
          <h2>How many people live in your home?</h2>
        </div>

        <div className="household-size-options">
          {options.map(option => (
            <IonButton
              key={option.label}
              fill="clear"
              className={`circle-option${
                selectedPeople === option.value ? ' selected' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </IonButton>
          ))}
        </div>

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

export default ListerHouseholdSize;
