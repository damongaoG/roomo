import React, { useCallback, useMemo, useState } from 'react';
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

const RANGE_MIN = 0;
const RANGE_MAX = 2000;

// Numeric clamping is provided by clampNumber util

const LookerRegistration: React.FC = () => {
  const [budgetRange, setBudgetRange] = useState<{
    lower: number;
    upper: number;
  }>({ lower: RANGE_MIN, upper: RANGE_MAX });
  const [touched, setTouched] = useState(false);
  const [lowerText, setLowerText] = useState(formatAUD(RANGE_MIN));
  const [upperText, setUpperText] = useState(formatAUD(RANGE_MAX));

  const isNextEnabled = useMemo(
    () => touched && budgetRange.upper > budgetRange.lower,
    [touched, budgetRange]
  );

  const handleLowerInput = useCallback((e: CustomEvent) => {
    const raw = (
      e as CustomEvent<{ value: string | number | null | undefined }>
    ).detail.value;
    const text = raw == null ? '' : String(raw);
    setLowerText(text);
    setTouched(true);
  }, []);

  const handleUpperInput = useCallback((e: CustomEvent) => {
    const raw = (
      e as CustomEvent<{ value: string | number | null | undefined }>
    ).detail.value;
    const text = raw == null ? '' : String(raw);
    setUpperText(text);
    setTouched(true);
  }, []);

  const commitLower = useCallback(() => {
    const parsed = parseAUDInput(lowerText);
    const clamped = clampNumber(parsed, RANGE_MIN, budgetRange.upper);
    setBudgetRange(prev => ({ ...prev, lower: clamped }));
    setLowerText(formatAUD(clamped));
  }, [lowerText, budgetRange.upper]);

  const commitUpper = useCallback(() => {
    const parsed = parseAUDInput(upperText);
    const clamped = clampNumber(parsed, budgetRange.lower, RANGE_MAX);
    setBudgetRange(prev => ({ ...prev, upper: clamped }));
    setUpperText(formatAUD(clamped));
  }, [upperText, budgetRange.lower]);

  const handleRangeInput = useCallback((e: CustomEvent) => {
    const next = e.detail.value as { lower: number; upper: number };
    setBudgetRange(next);
    setLowerText(formatAUD(next.lower));
    setUpperText(formatAUD(next.upper));
  }, []);

  const handleNext = () => {
    if (!isNextEnabled) return;
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
            onClick={() => window.history.back()}
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
            value={budgetRange}
            onIonInput={handleRangeInput}
            onIonChange={() => setTouched(true)}
          />

          <div className="range-labels">
            <div className="pill">
              <IonInput
                aria-label="Minimum"
                inputmode="decimal"
                type="text"
                value={lowerText}
                onIonInput={handleLowerInput}
                onIonChange={commitLower}
                onIonBlur={commitLower}
                placeholder="Minimum"
              />
            </div>
            <div className="pill">
              <IonInput
                aria-label="Maximum"
                inputmode="decimal"
                type="text"
                value={upperText}
                onIonInput={handleUpperInput}
                onIonChange={commitUpper}
                onIonBlur={commitUpper}
                placeholder="Maximum"
              />
            </div>
          </div>
        </div>

        {/* Next button */}
        <div className="bottom-actions">
          <IonButton
            expand="block"
            fill="clear"
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
