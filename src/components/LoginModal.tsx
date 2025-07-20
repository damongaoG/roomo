import React from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useAuth0 } from '@auth0/auth0-react';
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
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  // Handle social login
  const handleSocialLogin = async (connection: string) => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: connection,
          screen_hint: 'signup',
        },
      });
    } catch (error) {
      console.error(`${connection} login error:`, error);
    }
  };

  // Handle email login
  const handleEmailLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    } catch (error) {
      console.error('Email login error:', error);
    }
  };

  // Check if authenticated and call success callback
  React.useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

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

              {/* Login buttons */}
              <div className="login-buttons">
                {/* Facebook */}
                <IonButton
                  expand="block"
                  className="social-button facebook-button"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <div className="social-button-content">
                    <img
                      className="social-icon"
                      src="/assets/images/icons/facebook_instance.svg"
                      alt=""
                    />
                  </div>
                </IonButton>

                {/* Email */}
                <IonButton
                  expand="block"
                  className="social-button email-button"
                  onClick={handleEmailLogin}
                >
                  <div className="social-button-content">
                    <span>Email</span>
                  </div>
                </IonButton>

                {/* Apple */}
                <IonButton
                  expand="block"
                  className="social-button apple-button"
                  onClick={() => handleSocialLogin('apple')}
                >
                  <div className="social-button-content">
                    <img
                      className="social-icon"
                      src="/assets/images/icons/apple_vector.svg"
                      alt=""
                    />
                  </div>
                </IonButton>

                {/* Google */}
                <IonButton
                  expand="block"
                  className="social-button google-button"
                  onClick={() => handleSocialLogin('google-oauth2')}
                >
                  <div className="social-button-content">
                    <img
                      className="social-icon"
                      src="/assets/images/icons/google_vector.svg"
                      alt=""
                    />
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
    </IonModal>
  );
};

export default LoginModal;
