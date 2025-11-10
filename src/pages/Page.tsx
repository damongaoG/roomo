import { IonContent, IonPage, IonButton, IonToast } from '@ionic/react';
import './Page.css';
import './LookerRegistration.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../service/supabaseClient';
import { postUserRole, type UserRole } from '../service/userProfileApi';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthSession, setUserRole as setUserRoleAction } from '../store/slices/sessionSlice';
import { useAuth } from '../contexts/AuthContext';

type Role = UserRole;

const Page: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger';
  }>({ isOpen: false, message: '', color: 'success' });
  const { userId: ctxUserId } = useAuth();
  const authSession = useAppSelector(selectAuthSession);

  const withTimeout = async <T,>(
    promise: Promise<T>,
    ms: number,
    label: string
  ): Promise<T> => {
    return await new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${label} timeout after ${ms}ms`));
      }, ms);
      promise
        .then(value => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  const handleRoleSelection = async (role: Role) => {
    console.log('[Role] click', { role, isSubmitting });
    if (isSubmitting) {
      console.log('[Role] blocked: already submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Role] started');
      const accessToken = authSession?.access_token ?? null;

      let userId = ctxUserId ?? authSession?.user?.id ?? undefined;
      console.log('[Role] resolved userId', {
        userIdFromContext: ctxUserId,
        userIdFromSession: authSession?.user?.id,
        userId,
      });

      if (!userId) {
        console.log('[Role] fallback to getUser...');
        const { data: userData, error: userError } = await withTimeout(
          supabase.auth.getUser(),
          2000,
          'getUser'
        );
        console.log('[Role] getUser result', {
          userError,
          user: userData?.user,
        });
        if (userError) {
          setToast({
            isOpen: true,
            message: userError.message,
            color: 'danger',
          });
          return;
        }
        userId = userData.user?.id ?? undefined;
      }

      if (!userId) {
        console.warn('[Role] missing userId after all fallbacks');
        setToast({
          isOpen: true,
          message: 'Not logged in or session invalid',
          color: 'danger',
        });
        return;
      }

      if (!accessToken) {
        console.warn('[Role] missing access token');
        setToast({
          isOpen: true,
          message:
            'Unable to retrieve access credential. Please sign in again.',
          color: 'danger',
        });
        return;
      }

      console.log('[Role] calling backend API with payload', {
        user_id: userId,
        role,
      });
      const response = await withTimeout(
        postUserRole({ userId, role, accessToken }),
        8000,
        'set user role'
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('[Role] backend API failed', {
          status: response.status,
          errorText,
        });
        setToast({
          isOpen: true,
          message: 'Failed to set role',
          color: 'danger',
        });
        return;
      }

      console.log('[Role] role set successfully via backend');
      dispatch(setUserRoleAction(role));
      if (role === 'looker') {
        // Navigate to registration while profileExists is still false
        history.push('/looker/registration');
      } else if (role === 'lister') {
        history.push('/lister/registration');
      } else {
        history.push('/home');
      }
    } catch (error) {
      console.error('Error setting role:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setToast({
        isOpen: true,
        message,
        color: 'danger',
      });
    } finally {
      console.log('[Role] finalize: reset submitting');
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
