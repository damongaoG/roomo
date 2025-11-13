import React, { useEffect, useMemo } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerRoomFeatures.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  type RoomBedSizeOption,
  type RoomFeatureOption,
  selectNumberOfPeopleLiving,
  selectRoomName,
  selectRoomType,
  selectRoomFurnishing,
  selectRoomBathroom,
  selectRoomBedSize,
  selectRoomFeatures,
  setRoomBedSize,
  toggleRoomFeature,
  setRoomFeatures,
} from '../../../store/slices/listerPropertySlice';

const bedSizeOptions: { label: string; value: RoomBedSizeOption }[] = [
  { label: 'Single', value: 'single' },
  { label: 'Double', value: 'double' },
  { label: 'Queen', value: 'queen' },
  { label: 'King', value: 'king' },
  { label: 'None', value: 'none' },
];

const roomFeatureOptions: { label: string; value: RoomFeatureOption }[] = [
  { label: 'Lamp', value: 'lamp' },
  { label: 'Couch', value: 'couch' },
  { label: 'Kitchenette', value: 'kitchenette' },
  { label: 'Rug', value: 'rug' },
  { label: 'Plants', value: 'plants' },
  { label: 'Door locks', value: 'doorLocks' },
  { label: 'Chair', value: 'chair' },
  { label: 'TV', value: 'tv' },
  { label: 'Drawers', value: 'drawers' },
  { label: 'Bed side table', value: 'bedSideTable' },
  { label: 'Wardrobe', value: 'wardrobe' },
];

const ListerRoomFeatures: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const numberOfPeopleLiving = useAppSelector(selectNumberOfPeopleLiving);
  const roomName = useAppSelector(selectRoomName);
  const roomType = useAppSelector(selectRoomType);
  const roomFurnishing = useAppSelector(selectRoomFurnishing);
  const roomBathroom = useAppSelector(selectRoomBathroom);
  const roomBedSize = useAppSelector(selectRoomBedSize);
  const roomFeatures = useAppSelector(selectRoomFeatures);

  const selectedFeaturesSet = useMemo(
    () => new Set(roomFeatures),
    [roomFeatures]
  );

  useEffect(() => {
    if (numberOfPeopleLiving == null) {
      history.replace('/lister/household-size');
      return;
    }
    if (
      roomName.trim().length === 0 ||
      roomType == null ||
      roomFurnishing == null ||
      roomBathroom == null
    ) {
      history.replace('/lister/room-details');
    }
  }, [
    history,
    numberOfPeopleLiving,
    roomName,
    roomType,
    roomFurnishing,
    roomBathroom,
  ]);

  const isNextEnabled = roomBedSize != null;

  const handleNext = () => {
    if (!isNextEnabled || roomBedSize == null) return;
    const normalizedFeatures = roomFeatureOptions
      .map(option => option.value)
      .filter(value => selectedFeaturesSet.has(value));
    dispatch(setRoomBedSize(roomBedSize));
    dispatch(setRoomFeatures(normalizedFeatures));
    console.log('[ListerRoomFeatures] Next clicked', {
      bedSize: roomBedSize,
      roomFeatures: normalizedFeatures,
    });
    history.push('/lister/property-type');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page room-features-page">
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

        <div className="room-features-heading">
          <h2>More room features</h2>
        </div>

        <div className="room-features-content">
          <section aria-labelledby="bed-size-heading">
            <h3 id="bed-size-heading">Bed size</h3>
            <div className="feature-chip-group">
              {bedSizeOptions.map(option => (
                <IonButton
                  key={option.value}
                  fill="clear"
                  className={`feature-chip${
                    roomBedSize === option.value ? ' selected' : ''
                  }`}
                  onClick={() => dispatch(setRoomBedSize(option.value))}
                >
                  {option.label}
                </IonButton>
              ))}
            </div>
          </section>

          <section aria-labelledby="room-features-heading">
            <h3 id="room-features-heading">Room furnishings and features</h3>
            <div className="feature-chip-group">
              {roomFeatureOptions.map(option => {
                const isSelected = selectedFeaturesSet.has(option.value);
                return (
                  <IonButton
                    key={option.value}
                    fill="clear"
                    className={`feature-chip${isSelected ? ' selected' : ''}`}
                    onClick={() => dispatch(toggleRoomFeature(option.value))}
                  >
                    {option.label}
                  </IonButton>
                );
              })}
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

export default ListerRoomFeatures;
