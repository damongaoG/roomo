import React, { useState } from 'react';
import type { InputChangeEventDetail } from '@ionic/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
  IonInput,
  IonToast,
  IonSpinner,
  useIonLoading,
} from '@ionic/react';
import {
  close,
  chevronBackOutline,
  logoFacebook,
  logoApple,
  logoGoogle,
  mailOutline,
} from 'ionicons/icons';
import { supabase } from '../service/supabaseClient';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onDismiss,
  onLoginSuccess,
}) => {
  const [view, setView] = useState<'providers' | 'email'>('providers');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger';
  }>({ isOpen: false, message: '', color: 'success' });
  const [present, dismiss] = useIonLoading();

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await present({
        message: 'Signing up...',
        duration: 10000,
        keyboardClose: true,
      });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const hasSession = !!data.session;
      setToast({
        isOpen: true,
        message: hasSession
          ? 'Signed up successfully'
          : 'Signed up successfully, please verify your email to login',
        color: 'success',
      });
      if (hasSession && onLoginSuccess) onLoginSuccess();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Sign up failed';
      setToast({ isOpen: true, message, color: 'danger' });
    } finally {
      try {
        await dismiss();
      } catch {
        console.log('dismiss error');
      }
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await present({
        message: 'Signing in...',
        duration: 10000,
        keyboardClose: true,
      });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        console.log('[Auth] Login success: session acquired');
        setToast({
          isOpen: true,
          message: 'Signed in successfully',
          color: 'success',
        });
        try {
          const { data: sess } = await supabase.auth.getSession();
          const currentUserId = sess.session?.user?.id;
          console.log('[Auth] After login, current user id:', currentUserId);
        } catch (e) {
          console.warn('[Auth] getSession after login failed', e);
        }
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setToast({
          isOpen: true,
          message: 'Please verify your email to login',
          color: 'danger',
        });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Sign in failed';
      setToast({ isOpen: true, message, color: 'danger' });
    } finally {
      try {
        await dismiss();
      } catch {
        console.log('dismiss error');
      }
      setLoading(false);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      className={`login-modal ${view === 'email' ? 'email-view' : ''}`}
      breakpoints={[0, 1]}
      initialBreakpoint={1}
    >
      <IonPage>
        <IonContent fullscreen>
          <div
            className={`login-modal-container ${view === 'email' ? 'email-view' : ''}`}
          >
            {/* Close button */}
            <IonButton
              fill="clear"
              className="close-button"
              onClick={onDismiss}
            >
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>

            {/* Content */}
            <div className="login-content">
              <div style={{ display: 'flex' }}>
                {/* Title */}
                <h1 className="login-title">ROOMO</h1>

                {/* Back button (only on email view) */}
                {view === 'email' && (
                  <IonButton
                    fill="clear"
                    className="back-button"
                    onClick={() => setView('providers')}
                    aria-label="Back to providers"
                  >
                    <IonIcon slot="icon-only" icon={chevronBackOutline} />
                  </IonButton>
                )}
              </div>

              {/* Main heading */}
              <h2 className="login-heading">Let's get you logged in</h2>

              {/* Subheading */}
              <p className="login-subheading">
                Look for rooms, find local homies to live with.
              </p>

              {/* Verification text */}
              <p className="login-verification-text">
                For verification and safety we require you to
                <br />
                signup/login with one of the below options.
              </p>

              {/* Providers or Email view */}
              {view === 'providers' ? (
                <div className="login-buttons">
                  <IonButton
                    expand="block"
                    className="social-button provider-button"
                    disabled
                    aria-disabled="true"
                  >
                    <div className="social-button-content">
                      <IonIcon className="social-icon" icon={logoFacebook} />
                      <span>Facebook</span>
                    </div>
                  </IonButton>
                  <IonButton
                    expand="block"
                    className="social-button provider-button"
                    onClick={() => {
                      setAuthMode('login');
                      setView('email');
                    }}
                    aria-label="Sign in with Email"
                  >
                    <div className="social-button-content">
                      <IonIcon className="social-icon" icon={mailOutline} />
                      <span>Email</span>
                    </div>
                  </IonButton>
                  <IonButton
                    expand="block"
                    className="social-button provider-button"
                    disabled
                    aria-disabled="true"
                  >
                    <div className="social-button-content">
                      <IonIcon className="social-icon" icon={logoApple} />
                      <span>Apple</span>
                    </div>
                  </IonButton>
                  <IonButton
                    expand="block"
                    className="social-button provider-button"
                    disabled
                    aria-disabled="true"
                  >
                    <div className="social-button-content">
                      <IonIcon className="social-icon" icon={logoGoogle} />
                      <span>Google</span>
                    </div>
                  </IonButton>
                </div>
              ) : (
                <div className="email-actions">
                  <div style={{ width: '100%', marginBottom: 12 }}>
                    <IonInput
                      type="email"
                      placeholder="Email"
                      value={email}
                      autocomplete="email"
                      inputmode="email"
                      autocapitalize="off"
                      onIonChange={(e: CustomEvent<InputChangeEventDetail>) =>
                        setEmail(e.detail.value || '')
                      }
                    />
                  </div>
                  <div style={{ width: '100%', marginBottom: 12 }}>
                    <IonInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      autocomplete="current-password"
                      autocapitalize="off"
                      onIonChange={(e: CustomEvent<InputChangeEventDetail>) =>
                        setPassword(e.detail.value || '')
                      }
                    />
                  </div>
                  <IonButton
                    expand="block"
                    className="social-button email-button"
                    onClick={authMode === 'login' ? handleSignIn : handleSignUp}
                    disabled={loading}
                  >
                    <div className="social-button-content">
                      {loading && (
                        <IonSpinner
                          name="crescent"
                          style={{ width: 16, height: 16, marginRight: 8 }}
                        />
                      )}
                      <span>{authMode === 'login' ? 'Login' : 'Sign up'}</span>
                    </div>
                  </IonButton>
                  <IonButton
                    fill="clear"
                    size="small"
                    className="mode-switch-button"
                    onClick={() =>
                      setAuthMode(prev =>
                        prev === 'login' ? 'signup' : 'login'
                      )
                    }
                    disabled={loading}
                    aria-label={
                      authMode === 'login'
                        ? 'Switch to Sign up'
                        : 'Switch to Login'
                    }
                  >
                    {authMode === 'login'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Log in'}
                  </IonButton>
                </div>
              )}

              {/* Terms text */}
              <p className="terms-text">
                By continuing you agree to Roomo's{' '}
                <span className="terms-link">Terms of Use</span>.
              </p>
            </div>
          </div>
        </IonContent>
      </IonPage>
      <IonToast
        isOpen={toast.isOpen}
        onDidDismiss={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        duration={2500}
        color={toast.color}
      />
    </IonModal>
  );
};

export default LoginModal;
