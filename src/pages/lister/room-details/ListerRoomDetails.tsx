import React, { useEffect, useMemo, useId } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerRoomDetails.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectNumberOfPeopleLiving,
  selectRoomBathroom,
  selectRoomFurnishing,
  selectRoomName,
  selectRoomType,
  setRoomBathroom,
  setRoomFurnishing,
  setRoomName,
  setRoomType,
  type RoomBathroomOption,
  type RoomFurnishingOption,
  type RoomType,
} from '../../../store/slices/listerPropertySlice';

const roomTypeOptions: { label: string; value: RoomType }[] = [
  { label: 'Private', value: 'private' },
  { label: 'Shared', value: 'shared' },
];

const roomFurnishingOptions: { label: string; value: RoomFurnishingOption }[] =
  [
    { label: 'Flexible', value: 'flexible' },
    { label: 'Furnished', value: 'furnished' },
    { label: 'Unfurnished', value: 'unfurnished' },
  ];

const roomBathroomOptions: { label: string; value: RoomBathroomOption }[] = [
  { label: 'Own', value: 'own' },
  { label: 'Shared', value: 'shared' },
  { label: 'En-suite', value: 'en-suite' },
];

const ListerRoomDetails: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const roomNameInputId = useId();

  const numberOfPeopleLiving = useAppSelector(selectNumberOfPeopleLiving);
  const roomName = useAppSelector(selectRoomName);
  const roomType = useAppSelector(selectRoomType);
  const roomFurnishing = useAppSelector(selectRoomFurnishing);
  const roomBathroom = useAppSelector(selectRoomBathroom);

  const isNextEnabled =
    roomName.trim().length > 0 &&
    roomType != null &&
    roomFurnishing != null &&
    roomBathroom != null;

  useEffect(() => {
    if (numberOfPeopleLiving == null) {
      history.replace('/lister/household-size');
    }
  }, [history, numberOfPeopleLiving]);

  const roomTypeButtons = useMemo(
    () =>
      roomTypeOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`pill-option${roomType === option.value ? ' selected' : ''}`}
          onClick={() => dispatch(setRoomType(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [roomType, dispatch]
  );

  const roomFurnishingButtons = useMemo(
    () =>
      roomFurnishingOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`pill-option${roomFurnishing === option.value ? ' selected' : ''}`}
          onClick={() => dispatch(setRoomFurnishing(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [roomFurnishing, dispatch]
  );

  const roomBathroomButtons = useMemo(
    () =>
      roomBathroomOptions.map(option => (
        <IonButton
          key={option.value}
          fill="clear"
          className={`pill-option${roomBathroom === option.value ? ' selected' : ''}`}
          onClick={() => dispatch(setRoomBathroom(option.value))}
        >
          {option.label}
        </IonButton>
      )),
    [roomBathroom, dispatch]
  );

  const handleNext = () => {
    if (!isNextEnabled) return;
    dispatch(setRoomName(roomName.trim()));
    if (roomType != null) {
      dispatch(setRoomType(roomType));
    }
    if (roomFurnishing != null) {
      dispatch(setRoomFurnishing(roomFurnishing));
    }
    if (roomBathroom != null) {
      dispatch(setRoomBathroom(roomBathroom));
    }
    console.log('[ListerRoomDetails] Next clicked', {
      roomName,
      roomType,
      roomFurnishing,
      roomBathroom,
    });
    history.push('/lister/room-features');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page room-details-page">
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
          <h2>Tell me about your room</h2>
        </div>

        <div className="room-details-form">
          <div className="room-name-field">
            <label htmlFor={roomNameInputId} className="room-name-label">
              Room name
            </label>
            <input
              id={roomNameInputId}
              value={roomName}
              placeholder="Beautiful sunny bedroom..."
              onChange={event => dispatch(setRoomName(event.target.value))}
              aria-label="Room name"
              className="room-name-input"
              type="text"
            />
          </div>

          <section>
            <h3>Room type</h3>
            <div className="pill-options">{roomTypeButtons}</div>
          </section>

          <section>
            <h3>Room furnishings</h3>
            <div className="pill-options">{roomFurnishingButtons}</div>
          </section>

          <section>
            <h3>Bathroom</h3>
            <div className="pill-options">{roomBathroomButtons}</div>
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

export default ListerRoomDetails;
