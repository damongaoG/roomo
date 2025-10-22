import React, { useCallback, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonRange,
  IonInput,
} from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import './LookerRegistration.css';
import { formatAUD, parseAUDInput, clampNumber } from '../utils/currency';
import { useAppDispatch } from '../store';
import { setBudgetRange as setRegistrationBudgetRange } from '../store/slices/registrationSlice';
import { useHistory } from 'react-router-dom';

const RANGE_MIN = 0;
const RANGE_MAX = 2000;

// Numeric clamping is provided by clampNumber util

const LookerRegistration: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [weeklyBudget, setWeeklyBudget] = useState<{
    minBudgetPerWeek: number;
    maxBudgetPerWeek: number;
  }>({ minBudgetPerWeek: RANGE_MIN, maxBudgetPerWeek: RANGE_MAX });
  const [touched, setTouched] = useState(false);
  const [minBudgetText, setMinBudgetText] = useState(formatAUD(RANGE_MIN));
  const [maxBudgetText, setMaxBudgetText] = useState(formatAUD(RANGE_MAX));

  const isNextEnabled =
    touched && weeklyBudget.maxBudgetPerWeek > weeklyBudget.minBudgetPerWeek;

  const handleMinInput = useCallback((e: any) => {
    const raw = (
      e as CustomEvent<{ value?: string | number | null | undefined }>
    ).detail?.value;
    const text = raw == null ? '' : String(raw);
    setMinBudgetText(text);
    setTouched(true);
  }, []);

  const handleMaxInput = useCallback((e: any) => {
    const raw = (
      e as CustomEvent<{ value?: string | number | null | undefined }>
    ).detail?.value;
    const text = raw == null ? '' : String(raw);
    setMaxBudgetText(text);
    setTouched(true);
  }, []);

  const commitMin = useCallback(() => {
    const parsed = parseAUDInput(minBudgetText);
    const clamped = clampNumber(
      parsed,
      RANGE_MIN,
      weeklyBudget.maxBudgetPerWeek
    );
    setWeeklyBudget(prev => ({ ...prev, minBudgetPerWeek: clamped }));
    setMinBudgetText(formatAUD(clamped));
  }, [minBudgetText, weeklyBudget.maxBudgetPerWeek]);

  const commitMax = useCallback(() => {
    const parsed = parseAUDInput(maxBudgetText);
    const clamped = clampNumber(
      parsed,
      weeklyBudget.minBudgetPerWeek,
      RANGE_MAX
    );
    setWeeklyBudget(prev => ({ ...prev, maxBudgetPerWeek: clamped }));
    setMaxBudgetText(formatAUD(clamped));
  }, [maxBudgetText, weeklyBudget.minBudgetPerWeek]);

  const handleRangeInput = useCallback((e: any) => {
    const value = (
      e as CustomEvent<{ value: number | { lower: number; upper: number } }>
    ).detail.value;
    if (
      value &&
      typeof value === 'object' &&
      'lower' in value &&
      'upper' in value
    ) {
      const next = value as { lower: number; upper: number };
      setWeeklyBudget({
        minBudgetPerWeek: next.lower,
        maxBudgetPerWeek: next.upper,
      });
      setMinBudgetText(formatAUD(next.lower));
      setMaxBudgetText(formatAUD(next.upper));
    }
  }, []);

  const handleNext = () => {
    if (!isNextEnabled) return;
    dispatch(
      setRegistrationBudgetRange({
        minBudgetPerWeek: weeklyBudget.minBudgetPerWeek,
        maxBudgetPerWeek: weeklyBudget.maxBudgetPerWeek,
      })
    );
    history.push('/looker/move-in-area');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="looker-page">
        {/* Top brand + back */}
        <div className="looker-brand">
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

        {/* Chat bubble with avatar */}
        <div className="chat-interface">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img src="/assets/images/icons/jeny_blink.png" alt="Jenny" />
            </div>
            <div className="chat-bubble">
              <span>
                I can always change your budget preferences at a later date.
              </span>
            </div>
          </div>
        </div>

        {/* Main question */}
        <div className="main-question">
          <span>What’s your max budget per week?</span>
        </div>

        {/* Slider */}
        <div className="slider-section">
          <IonRange
            min={RANGE_MIN}
            max={RANGE_MAX}
            step={10}
            dualKnobs={true}
            value={{
              lower: weeklyBudget.minBudgetPerWeek,
              upper: weeklyBudget.maxBudgetPerWeek,
            }}
            onIonInput={handleRangeInput}
            onIonChange={() => setTouched(true)}
          />

          <div className="range-labels">
            <div className="pill">
              <IonInput
                aria-label="Minimum"
                inputmode="decimal"
                type="text"
                value={minBudgetText}
                onIonInput={handleMinInput}
                onIonChange={commitMin}
                onIonBlur={commitMin}
                debounce={150}
                placeholder="Minimum"
              />
            </div>
            <div className="pill">
              <IonInput
                aria-label="Maximum"
                inputmode="decimal"
                type="text"
                value={maxBudgetText}
                onIonInput={handleMaxInput}
                onIonChange={commitMax}
                onIonBlur={commitMax}
                debounce={150}
                placeholder="Maximum"
              />
            </div>
          </div>
        </div>

        {/* Next button */}
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

export default LookerRegistration;
