import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Bot from '../../containers/Bot/Bot';
import Insight from '../../containers/Insight/Insight';
import Channel from '../../containers/channel/Channel';
import ExpandableSteps from '../addmember/ExpandableSteps';
import Header from './Header';
import GenerateMyProfile from './GenerateMyProfile';
import UserSettings from '../../containers/UserSettings/UserSettings';

const Home = () => {
  const [currentScreen, setCurrentScreen] = useState('default');
  const [status, setStatus] = useState([]);
  const [channel, setChannel] = useState(null);
  const [loggedInUserPersona, setLoggedInUserPersona]  = useState(null);

  useEffect(() => {
    console.log('currentScreen changed to:', currentScreen);
  }, [currentScreen]); // This useEffect logs when `currentScreen` changes

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'home' });

    const messageListener = (message) => {
      if (message.type === 'GET_SCREEN') {
        const response = {
          type: 'GET_SCREEN_RESPONSE',
          data: {
            text: message.data.text,
            event: message.data.event,
          },
          screen: currentScreen,
        };

        if (currentScreen === 'channels' && channel) {
          response.channel = channel;
        }

        port.postMessage(response);
      }
      if (message.type === 'SWITCH_TO_BOT_SCREEN') {
        document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
        document.getElementById('ActiveTabTitle').innerHTML = 'PsyGenie Assistant';
        document.getElementById('bot-li-item').classList.add('active');
        setCurrentScreen('bot');
      }
    };

    port.onMessage.addListener(messageListener);

    return () => {
      port.onMessage.removeListener(messageListener);
      port.disconnect();
    };
  }, [currentScreen, channel]);

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  const handleChannelSelect = (channel) => {
    setChannel(channel);
  };

  const renderScreen = () => {
    console.log('Rendering screen for:', currentScreen);
    switch (currentScreen) {
      case 'bot':
        return <Bot />;
      case 'insight':
        return <Insight onScreenChange={handleScreenChange} status={status} />;
      case 'channels':
        return <Channel onScreenChange={handleScreenChange} status={status} channelSelect={handleChannelSelect} loggedInUserPersona = {loggedInUserPersona}/>;
      case 'addmember':
        return <ExpandableSteps isLoggedInUser={false} onScreenChange={handleScreenChange} />;
      case 'my_profile':
        return <GenerateMyProfile onScreenChange={handleScreenChange} setStatus={setStatus} setLoggedInUserPersona = {setLoggedInUserPersona}/>;
      case 'settings':
        return <UserSettings onScreenChange={handleScreenChange} />;
      default:
        return <GenerateMyProfile onScreenChange={handleScreenChange} setStatus={setStatus} setLoggedInUserPersona = {setLoggedInUserPersona}/>;
    }
  };

  return (
    <div className="home-container">
      <Menu onScreenChange={handleScreenChange} />
      <Header />
      {renderScreen()}
    </div>
  );
};

export default Home;
