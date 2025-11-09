import React from 'react';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage className="home-page">
      <IonHeader className="home-header" translucent={false}>
        <IonToolbar className="home-toolbar">
          <div style={{"display": "flex", "paddingTop": "3rem"}}>
             <button type="button" className="icon-button" aria-label="打开菜单">
            <img src="/assets/images/icons/menu-02.svg" alt="" />
          </button>

          <div className="chat-tabs" role="tablist" aria-label="聊天筛选">
            <button
              type="button"
              role="tab"
              aria-selected="true"
              className="chat-tab chat-tab--active"
            >
              Jenny chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="false"
              className="chat-tab"
            >
              Matches
            </button>
          </div>

          <button type="button" className="icon-button" aria-label="查看消息">
            <img src="/assets/images/icons/Inbox.svg" alt="" />
          </button>
          </div>
         
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <div className="chat-body">
          <div className="jenny-activity">
            <div className="avatar-card">
              <div className="avatar-frame">
                <img
                  src="/assets/images/icons/jeny_blink.png"
                  alt="Jenny 的头像"
                />
              </div>
            </div>
          </div>

          <button type="button" className="say-hi-button">
            Say Hi <span aria-hidden="true">👋</span> to Jenny
          </button>
        </div>
      </IonContent>

      <IonFooter className="home-footer">
        <IonToolbar className="home-footer-toolbar">
          <div className="message-input-bar">
            <button
              type="button"
              className="message-action"
              aria-label="发送图片"
            >
              <img src="/assets/images/icons/image_instance.svg" alt="" />
            </button>
            <button
              type="button"
              className="message-action"
              aria-label="打开相机"
            >
              <img src="/assets/images/icons/camera_instance.svg" alt="" />
            </button>
            <button
              type="button"
              className="message-action"
              aria-label="更多操作"
            >
              <img src="/assets/images/icons/plus_group.svg" alt="" />
            </button>

            <label className="message-field" htmlFor="message-input">
              <span className="sr-only">输入消息</span>
              <input
                id="message-input"
                type="text"
                placeholder="Message"
                aria-label="消息输入框"
              />
            </label>

            <button
              type="button"
              className="message-action"
              aria-label="语音消息"
            >
              <img src="/assets/images/icons/mic_instance.svg" alt="" />
            </button>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
