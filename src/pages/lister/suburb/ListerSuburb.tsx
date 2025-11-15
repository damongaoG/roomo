import React, { useCallback, useState } from 'react';
import type { InputInputEventDetail } from '@ionic/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
} from '@ionic/react';
import { arrowForward, chevronBack, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { setSuburb as setRegistrationSuburb } from '../../../store/slices/registrationSlice';
import '../registration/ListerRegistration.css';
import './ListerSuburb.css';

const ListerSuburb: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [suburb, setSuburb] = useState('');

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleInput = useCallback(
    (event: CustomEvent<InputInputEventDetail>) => {
      setSuburb(event.detail.value ?? '');
    },
    []
  );

  const isNextEnabled = suburb.trim().length > 0;

  const handleNext = useCallback(() => {
    if (!isNextEnabled) return;
    const trimmedSuburb = suburb.trim();
    dispatch(setRegistrationSuburb(trimmedSuburb));
    console.log('[ListerSuburb] Next clicked', { suburb: trimmedSuburb });
    history.push('/lister/available-date');
  }, [dispatch, history, isNextEnabled, suburb]);

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page suburb-page">
        <div className="lister-brand">
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

        <div className="lister-chat">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img
                src="/assets/images/icons/jeny_blink.png"
                alt="Jenny avatar"
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

        <div className="lister-question suburb-question">
          <h2>
            What suburb is the room
            <br />
            available in?
          </h2>
        </div>

        <div className="suburb-input-section" aria-label="Room suburb">
          <div className="suburb-input-wrapper">
            <IonIcon
              icon={searchOutline}
              className="suburb-search-icon"
              aria-hidden="true"
            />
            <IonInput
              aria-label="Room suburb"
              className="suburb-input"
              placeholder="Enter suburb"
              type="text"
              inputmode="text"
              value={suburb}
              onIonInput={handleInput}
            />
          </div>
        </div>

        <div className="suburb-bottom-actions">
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

export default ListerSuburb;
