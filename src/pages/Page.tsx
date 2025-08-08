import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
  IonButton,
  IonToast,
} from '@ionic/react';
import './Page.css';
import React, { useState } from 'react';
import { useApiService } from '../service/api';

const Page: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger';
  }>({ isOpen: false, message: '', color: 'success' });

  const { setUserRole } = useApiService();

  const handleRoleSelection = async (role: 'looker' | 'lister') => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await setUserRole(role);

      if (result.success && result.data) {
        console.log('Role set successfully:', result.data);
      } else {
        setToast({
          isOpen: true,
          message: result.error || 'Failed to set role',
          color: 'danger',
        });
      }
    } catch (error) {
      setToast({
        isOpen: true,
        message: 'An unexpected error occurred',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen className="roomo-page">
        {/* ROOMO Brand Header */}
        <div className="roomo-brand">
          <h1>ROOMO</h1>
        </div>

        {/* Chat Interface with Jenny */}
        <div className="chat-interface">
          <div className="jenny-chat">
            <div className="jenny-avatar">
              <img src="/assets/images/icons/jeny_blink.png" alt="Jenny" />
            </div>
            <div className="chat-bubble">
              <span>Hi I'm Jenny 👋 nice to meet you</span>
            </div>
          </div>
        </div>

        {/* Main Question */}
        <div className="main-question">
          <span>
            Are you looking for a room
            <br />
            or listing a room?
          </span>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <IonButton
            fill="clear"
            className="choice-button"
            onClick={() => handleRoleSelection('looker')}
          >
            {isSubmitting ? 'Setting...' : "I'm looking for a room"}
          </IonButton>

          <IonButton
            fill="clear"
            className="choice-button"
            onClick={() => handleRoleSelection('lister')}
          >
            {isSubmitting ? 'Setting...' : "I'm listing a room"}
          </IonButton>
        </div>

        <IonToast
          isOpen={toast.isOpen}
          onDidDismiss={() => setToast({ ...toast, isOpen: false })}
          message={toast.message}
          duration={3000}
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default Page;
