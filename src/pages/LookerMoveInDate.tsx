import React, { useCallback, useMemo, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonIcon,
  IonPage,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setMoveindate } from '../store/slices/registrationSlice';
import './LookerRegistration.css';
import './LookerMoveInDate.css';
import { supabase } from '../service/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

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

const LookerMoveInDate: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const registration = useAppSelector(state => state.registration);
  const { userId } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleNext = useCallback(async () => {
    if (!isNextEnabled || submitting) return;

    const dateOnly = selectedDate ? selectedDate.slice(0, 10) : null;
    // Save to registrationSlice
    dispatch(setMoveindate(dateOnly));

    setSubmitting(true);
    const payload = {
      min_budget_per_week: registration.minBudgetPerWeek ?? null,
      max_budget_per_week: registration.maxBudgetPerWeek ?? null,
      suburb: registration.suburb || null,
      move_in_date: dateOnly,
      user_id: userId ?? null,
    } as Record<string, unknown>;

    const { data, error } = await supabase
      .from('search_preferences')
      .insert([payload])
      .select();

    if (error) {
      // Minimal error handling; could be enhanced with UI feedback
      console.warn('[LookerMoveInDate] insert error', error);
      setSubmitting(false);
      return;
    }

    // Optional: log returned row(s)
    if (data) {
      // console.log('[LookerMoveInDate] insert success', data);
    }

    history.push('/home');
  }, [
    dispatch,
    history,
    isNextEnabled,
    registration.maxBudgetPerWeek,
    registration.minBudgetPerWeek,
    registration.suburb,
    selectedDate,
    submitting,
    userId,
  ]);

  return (
    <IonPage>
      <IonContent fullscreen className="looker-page">
        {/* Top brand + back */}
        <div className="looker-brand">
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
        <div className="chat-interface">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img
                src="/assets/images/icons/jeny_blink.png"
                alt="Jenny"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="chat-bubble">
              <span>{'Your move in date can be an approximate for now'}</span>
            </div>
          </div>
        </div>

        {/* Main question */}
        <div className="main-question">
          <span>{"What's your move-in date?"}</span>
        </div>

        {/* Date card */}
        <div className="date-section">
          <div
            className="date-card"
            role="group"
            aria-label="Move-in date selector"
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
        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="solid"
            className={`next-button${isNextEnabled ? ' enabled' : ''}`}
            disabled={!isNextEnabled || submitting}
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

export default LookerMoveInDate;
