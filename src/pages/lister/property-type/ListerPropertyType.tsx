import React, { useMemo, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonPage,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerPropertyType.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectPropertyType,
  setPropertyType,
} from '../../../store/slices/listerPropertySlice';

type PropertyTypeOption = 'house' | 'apartment';

const propertyTypeCopy: Record<PropertyTypeOption, string> = {
  house: 'House',
  apartment: 'Apartment',
};

const ListerPropertyType: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const storedPropertyType = useAppSelector(selectPropertyType);
  const initialOption = useMemo<PropertyTypeOption | null>(() => {
    if (storedPropertyType === 'house' || storedPropertyType === 'apartment') {
      return storedPropertyType;
    }
    return null;
  }, [storedPropertyType]);
  const [selectedOption, setSelectedOption] =
    useState<PropertyTypeOption | null>(initialOption);

  const handleNext = () => {
    if (!selectedOption) return;
    dispatch(setPropertyType(selectedOption));
    history.push('/lister/property-details');
  };

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
      </IonContent>
      <IonFooter className="bottom-actions lister-bottom-actions">
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
      </IonFooter>
    </IonPage>
  );
};

export default ListerPropertyType;
