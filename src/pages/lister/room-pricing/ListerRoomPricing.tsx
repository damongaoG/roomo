import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonRange,
  type RangeChangeEventDetail,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerRoomPricing.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectNumberOfPeopleLiving,
  selectRoomName,
  selectRoomType,
  selectRoomFurnishing,
  selectRoomBathroom,
  selectRoomBedSize,
  selectWeeklyRentPerWeek,
  selectBillsIncludedInRent,
  setWeeklyRentPerWeek,
  setBillsIncludedInRent,
} from '../../../store/slices/listerPropertySlice';
import { formatAUD } from '../../../utils/currency';

const RANGE_MIN = 0;
const RANGE_MAX = 2000;
const RANGE_STEP = 10;
const DEFAULT_WEEKLY_RENT = 210;

const ListerRoomPricing: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const numberOfPeopleLiving = useAppSelector(selectNumberOfPeopleLiving);
  const roomName = useAppSelector(selectRoomName);
  const roomType = useAppSelector(selectRoomType);
  const roomFurnishing = useAppSelector(selectRoomFurnishing);
  const roomBathroom = useAppSelector(selectRoomBathroom);
  const roomBedSize = useAppSelector(selectRoomBedSize);
  const storedWeeklyRent = useAppSelector(selectWeeklyRentPerWeek);
  const storedBillsIncluded = useAppSelector(selectBillsIncludedInRent);

  const [weeklyRent, setWeeklyRent] = useState<number>(
    storedWeeklyRent ?? DEFAULT_WEEKLY_RENT
  );
  const [billsIncluded, setBillsIncluded] = useState<boolean | null>(
    storedBillsIncluded
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
      return;
    }
    if (roomBedSize == null) {
      history.replace('/lister/room-features');
    }
  }, [
    history,
    numberOfPeopleLiving,
    roomName,
    roomType,
    roomFurnishing,
    roomBathroom,
    roomBedSize,
  ]);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleRangeChange = useCallback(
    (event: CustomEvent<RangeChangeEventDetail>) => {
      const value = event.detail.value;
      if (typeof value === 'number') {
        setWeeklyRent(value);
      }
    },
    []
  );

  const formattedWeeklyRent = useMemo(
    () => formatAUD(weeklyRent),
    [weeklyRent]
  );

  const isNextEnabled = weeklyRent > 0 && billsIncluded != null;

  const handleNext = () => {
    if (!isNextEnabled || billsIncluded == null) return;
    dispatch(setWeeklyRentPerWeek(weeklyRent));
    dispatch(setBillsIncludedInRent(billsIncluded));
    console.log('[ListerRoomPricing] Next clicked', {
      weekly_rent_per_week: weeklyRent,
      bills_included_in_rent: billsIncluded,
    });
    history.push('/lister/suburb');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="lister-page room-pricing-page">
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
              />
            </div>
            <div className="chat-bubble">
              <span>
                You’ll be able to change this later on in your profile.
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

        <div className="room-pricing-heading">
          <h2>
            How much will you charge
            <br />
            per week?
          </h2>
        </div>

        <div className="room-pricing-content">
          <section aria-label="Weekly rent selector">
            <div className="room-pricing-slider">
              <IonRange
                min={RANGE_MIN}
                max={RANGE_MAX}
                step={RANGE_STEP}
                value={weeklyRent}
                onIonChange={handleRangeChange}
                aria-label="Weekly rent amount"
              />
            </div>
            <div className="room-pricing-price-card" aria-live="polite">
              <span className="price-text">{formattedWeeklyRent}</span>
            </div>
            <p className="room-pricing-bond-note">
              Bond is automatically set at 2 weeks&apos; rent, but you can
              update this anytime in your profile settings.
            </p>
          </section>

          <section
            aria-labelledby="bills-included-heading"
            className="room-pricing-bills-section"
          >
            <h3 id="bills-included-heading">Bills included in rent</h3>
            <div className="bills-pill-group" role="radiogroup">
              <IonButton
                fill="clear"
                className={`bills-pill${billsIncluded === true ? ' selected' : ''}`}
                onClick={() => setBillsIncluded(true)}
                aria-checked={billsIncluded === true}
                role="radio"
              >
                Yes
              </IonButton>
              <IonButton
                fill="clear"
                className={`bills-pill${billsIncluded === false ? ' selected' : ''}`}
                onClick={() => setBillsIncluded(false)}
                aria-checked={billsIncluded === false}
                role="radio"
              >
                No
              </IonButton>
            </div>
          </section>
        </div>

        <div className="room-pricing-bottom-actions">
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

export default ListerRoomPricing;
