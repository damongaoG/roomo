import React, { useEffect, useMemo } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerPropertyDetails.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectPropertyType,
  selectBathroomsNumber,
  selectBedroomsNumber,
  selectParking,
  setBathroomsNumber,
  setBedroomsNumber,
  setParking,
  type ParkingOption,
} from '../../../store/slices/listerPropertySlice';

const bedroomOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '5+', value: 6 },
] as const;

const bathroomOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '5+', value: 6 },
] as const;

const parkingOptions: { label: string; value: ParkingOption }[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'On-street', value: 'on-street' },
];

const ListerPropertyDetails: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const bedroomsNumber = useAppSelector(selectBedroomsNumber);
  const bathroomsNumber = useAppSelector(selectBathroomsNumber);
  const parking = useAppSelector(selectParking);
  const propertyType = useAppSelector(selectPropertyType);

  const isNextEnabled =
    bedroomsNumber != null && bathroomsNumber != null && parking != null;

  useEffect(() => {
    if (!propertyType) {
      history.replace('/lister/property-type');
    }
  }, [history, propertyType]);

  const bedroomButtons = useMemo(
    () =>
      bedroomOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`circle-option${
            bedroomsNumber === option.value ? ' selected' : ''
          }`}
          onClick={() => dispatch(setBedroomsNumber(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [bedroomsNumber, dispatch]
  );

  const bathroomButtons = useMemo(
    () =>
      bathroomOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`circle-option${
            bathroomsNumber === option.value ? ' selected' : ''
          }`}
          onClick={() => dispatch(setBathroomsNumber(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [bathroomsNumber, dispatch]
  );

  const parkingButtons = useMemo(
    () =>
      parkingOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`circle-option parking${
            parking === option.value ? ' selected' : ''
          }`}
          onClick={() => dispatch(setParking(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [parking, dispatch]
  );

  const handleNext = () => {
    if (!isNextEnabled) return;
    if (bedroomsNumber != null) {
      dispatch(setBedroomsNumber(bedroomsNumber));
    }
    if (bathroomsNumber != null) {
      dispatch(setBathroomsNumber(bathroomsNumber));
    }
    if (parking != null) {
      dispatch(setParking(parking));
    }
    console.log('[ListerPropertyDetails] Next clicked', {
      bedroomsNumber,
      bathroomsNumber,
      parking,
    });
    history.push('/lister/household-size');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page property-details-page">
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
          <h2>Tell me about your property</h2>
        </div>

        <div className="property-details-section">
          <section>
            <h3>Total bedrooms</h3>
            <div className="circle-options">{bedroomButtons}</div>
          </section>

          <section>
            <h3>Total bathrooms</h3>
            <div className="circle-options">{bathroomButtons}</div>
          </section>

          <section>
            <h3>Parking</h3>
            <div className="circle-options parking-options">
              {parkingButtons}
            </div>
          </section>
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

export default ListerPropertyDetails;
