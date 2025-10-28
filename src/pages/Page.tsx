import { IonContent, IonPage, IonButton, IonToast } from '@ionic/react';
import './Page.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  supabase,
  getSupabaseConfigStatus,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from '../service/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

type Role = 'looker' | 'lister';

const Page: React.FC = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger';
  }>({ isOpen: false, message: '', color: 'success' });
  const { userId: ctxUserId } = useAuth();

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
      const { hasSupabaseConfig, supabaseUrlPresent, supabaseAnonKeyPresent } =
        getSupabaseConfigStatus();
      console.log('[Role] supabase config', {
        hasSupabaseConfig,
        supabaseUrlPresent,
        supabaseAnonKeyPresent,
      });
      if (!hasSupabaseConfig) {
        setToast({
          isOpen: true,
          message: 'Supabase not configured',
          color: 'danger',
        });
        console.warn('[Role] missing supabase config');
        return;
      }

      try {
        const health = await withTimeout(
          fetch(`${SUPABASE_URL}/auth/v1/health`, { method: 'GET' }),
          3000,
          'auth health'
        );
        console.log('[Role] auth health status', health.status);
      } catch {
        console.warn('[Role] auth health failed');
        setToast({
          isOpen: true,
          message:
            'Network error or backend unreachable, please try again later',
          color: 'danger',
        });
        return;
      }

      let userId = ctxUserId ?? undefined;
      console.log('[Role] userId from context', { userId });

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

      console.log('[Role] final userId', { userId });
      if (!userId) {
        setToast({
          isOpen: true,
          message: 'Not logged in or session invalid',
          color: 'danger',
        });
        return;
      }

      const now = new Date().toISOString();
      const payload = {
        created_at: now,
        updated_at: now,
        user_id: userId,
        role,
      };

      console.log('[Role] inserting profile...', payload);
      try {
        const { data, error } = await withTimeout(
          supabase.from('user_profile').insert([payload]).select('user_id'),
          8000,
          'insert user_profile'
        );
        console.log('[Role] insert result (sdk)', { error, data });
        if (error) {
          throw error;
        }
      } catch {
        console.warn('[Role] sdk insert fallback to REST');
        const restUrl = `${SUPABASE_URL}/rest/v1/user_profile`;
        console.log('[Role] rest insert url', restUrl);
        const res = await withTimeout(
          fetch(restUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify(payload),
          }),
          8000,
          'rest insert user_profile'
        );
        console.log('[Role] rest insert status', res.status);
        if (!res.ok) {
          const text = await res.text();
          setToast({
            isOpen: true,
            message: `Insert failed: ${res.status} ${text}`,
            color: 'danger',
          });
          return;
        }
      }

      console.log('Role set successfully');
      history.push('/looker/registration');
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
