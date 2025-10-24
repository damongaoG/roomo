import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
  IonInput,
  IonToast,
} from '@ionic/react';
import { close } from 'ionicons/icons';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color: 'success' | 'danger';
  }>({ isOpen: false, message: '', color: 'success' });

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);
    try {
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
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        setToast({
          isOpen: true,
          message: 'Signed in successfully',
          color: 'success',
        });
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
      setLoading(false);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      className="login-modal"
      breakpoints={[0, 1]}
      initialBreakpoint={1}
    >
      <IonPage>
        <IonContent fullscreen>
          <div className="login-modal-container">
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
              {/* Title */}
              <h1 className="login-title">ROOMO</h1>

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

              {/* Email & Password */}
              <div className="login-buttons">
                <div style={{ width: '100%', marginBottom: 12 }}>
                  <IonInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onIonChange={e => setEmail(e.detail.value || '')}
                  />
                </div>
                <div style={{ width: '100%', marginBottom: 12 }}>
                  <IonInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onIonChange={e => setPassword(e.detail.value || '')}
                  />
                </div>
                <IonButton
                  expand="block"
                  className="social-button email-button"
                  onClick={handleSignIn}
                  disabled={loading}
                >
                  <div className="social-button-content">
                    <span>{loading ? 'Loading...' : 'Login'}</span>
                  </div>
                </IonButton>
                <IonButton
                  expand="block"
                  className="social-button facebook-button"
                  onClick={handleSignUp}
                  disabled={loading}
                >
                  <div className="social-button-content">
                    <span>{loading ? 'Loading...' : 'Sign up'}</span>
                  </div>
                </IonButton>
              </div>

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
