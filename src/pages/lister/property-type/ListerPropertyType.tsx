import React, { useState } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerPropertyType.css';

type PropertyTypeOption = 'house' | 'apartment';

const propertyTypeCopy: Record<PropertyTypeOption, string> = {
  house: 'House',
  apartment: 'Apartment',
};

const ListerPropertyType: React.FC = () => {
  const history = useHistory();
  const [selectedOption, setSelectedOption] =
    useState<PropertyTypeOption | null>(null);

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page property-type-page">
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
          <h2>Type of property</h2>
        </div>

        <div className="property-type-options" role="list">
          {(Object.keys(propertyTypeCopy) as PropertyTypeOption[]).map(
            option => (
              <IonButton
                key={option}
                fill="clear"
                className={`option-button${
                  selectedOption === option ? ' selected' : ''
                }`}
                onClick={() => setSelectedOption(option)}
                role="listitem"
              >
                {propertyTypeCopy[option]}
              </IonButton>
            )
          )}
        </div>

        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="solid"
            className={`next-button${selectedOption ? ' enabled' : ''}`}
            disabled={!selectedOption}
          >
            Next
            <IonIcon icon={arrowForward} slot="end" />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListerPropertyType;
