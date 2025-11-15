import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonIcon,
  IonPage,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectAvailableFromDate,
  setAvailableFromDate,
} from '../../../store/slices/listerPropertySlice';
import '../registration/ListerRegistration.css';
import './ListerAvailableDate.css';

const formatDisplayDate = (iso: string): string => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const ListerAvailableDate: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const storedAvailableFromDate = useAppSelector(selectAvailableFromDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (storedAvailableFromDate) {
      // Convert YYYY-MM-DD back to an ISO string for IonDatetime
      const iso = `${storedAvailableFromDate}T00:00:00.000Z`;
      setSelectedDate(iso);
    }
  }, [storedAvailableFromDate]);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const isNextEnabled = selectedDate != null;

  const displayDate = useMemo(() => {
    if (!selectedDate) return 'Select';
    return formatDisplayDate(selectedDate);
  }, [selectedDate]);

  const { minDateStr, maxDateStr } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const minYear = currentYear - 50;
    const maxYear = currentYear + 2;
    const minDate = `${minYear}-01-01`;
    const maxDate = `${maxYear}-12-31`;
    return { minDateStr: minDate, maxDateStr: maxDate };
  }, []);

  const handleNext = useCallback(() => {
    if (!isNextEnabled) return;
    const dateOnly = selectedDate ? selectedDate.slice(0, 10) : null;
    dispatch(setAvailableFromDate(dateOnly));
    console.log('[ListerAvailableDate] Next clicked', {
      available_from_date: dateOnly,
    });
  }, [dispatch, isNextEnabled, selectedDate]);

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="lister-page available-date-page"
        aria-label="Room available date"
      >
        {/* Top brand + back */}
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

        {/* Chat bubble with avatar */}
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
              <span>{'Your move in date can be an approximate for now'}</span>
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
        <div className="lister-question available-date-question">
          <h2>When’s your room available?</h2>
        </div>

        {/* Date card */}
        <div className="date-section">
          <div
            className="date-card"
            role="group"
            aria-label="Room available date selector"
          >
            <div className="date-card-header">
              <span className="label">Due Date</span>
              <span className="value" aria-live="polite">
                {displayDate}
              </span>
            </div>

            <div className="date-wheel">
              <IonDatetime
                presentation="date"
                preferWheel={true}
                min={minDateStr}
                max={maxDateStr}
                value={selectedDate ?? undefined}
                onIonChange={e => {
                  const val = e.detail.value as string | string[] | null;
                  let next: string | null = null;
                  if (Array.isArray(val)) {
                    next = val[0] ?? null;
                  } else {
                    next = val ?? null;
                  }
                  setSelectedDate(next);
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Next button */}
        <div className="bottom-actions lister-bottom-actions">
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

export default ListerAvailableDate;
