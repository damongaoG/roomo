import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import './Page.css';

const Page: React.FC = () => {
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
            onClick={() => console.log('Looking for room')}
          >
            I'm looking for a room
          </IonButton>

          <IonButton
            fill="clear"
            className="choice-button"
            onClick={() => console.log('Listing a room')}
          >
            I'm listing a room
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
