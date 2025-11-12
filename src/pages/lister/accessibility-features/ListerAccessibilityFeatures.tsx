import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, chevronBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../registration/ListerRegistration.css';
import './ListerAccessibilityFeatures.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  selectAccessibilityFeatures,
  setAccessibilityFeatures,
} from '../../../store/slices/listerPropertySlice';

const ACCESSIBILITY_FEATURE_OPTIONS = [
  'Lift',
  'Bathroom grip rails',
  'Step free home',
  'Roll-in shower',
  'Level access at home',
  'Wider doorways',
] as const;

const ListerAccessibilityFeatures: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const savedFeatures = useAppSelector(selectAccessibilityFeatures);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => 
    savedFeatures ?? []
  );

  useEffect(() => {
    setSelectedFeatures(savedFeatures ?? []);
  }, [savedFeatures]);

  const options = useMemo(() => [...ACCESSIBILITY_FEATURE_OPTIONS], []);

  const toggleFeature = useCallback((value: string) => {
    setSelectedFeatures(prev => 
        prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  }, []);

  const handleSkip = useCallback(() => {
    dispatch(setAccessibilityFeatures([]));
    history.push('/lister/household-size');
  }, [dispatch, history]);

  const handleNext = useCallback(() => {
    dispatch(setAccessibilityFeatures(selectedFeatures));
    history.push('/lister/household-size');
  }, [dispatch, history, selectedFeatures]);

  const isNextEnabled = selectedFeatures.length > 0;

  return (
    <IonPage>
        <IonContent
        fullscreen
        className="lister-page accessibility-features-page"
        >
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
                <span>
                If we’ve missed an accessibility feature, please let Jenny know
                later on in the chat.
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

            <div className="lister-question">
            <h2>Do you have any accessibility features?</h2>
            </div>
            
            <div className="accessibility-options">
                {options.map(option => {
                    const isSelected = selectedFeatures.includes(option);
                    return (
                        <IonButton
                        key={option}
                        fill="clear"
                        className={`pill-option${isSelected ? ' selected' : ''}`}
                        onClick={() => toggleFeature(option)}
                        >
                            {option}
                        </IonButton>
                    );
                })}
            </div>

            <div className="accessibility-skip">
                <button type="button" onClick={handleSkip}>
                    Skip
                </button>
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

export default ListerAccessibilityFeatures;

