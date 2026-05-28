import React, { useEffect, useState } from 'react';
import './Sidepanel.css';
import { axiosInstance, setupAxiosInterceptor } from '../../API/CustomAxiosConfig';
import { useAuth } from '../Auth/AuthContext';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import logo from '../../assets/img/logo';
import { APP_URL, APP_DOMAIN } from '../../API/Config/AppConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import RotatingLogo from "./RotatingLogo";
import Bot from '../../containers/Bot/Bot';



const Sidepanel = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [message, setMessage] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setupAxiosInterceptor(setIsLoggedIn, isLoggedIn, setLoader);

    // Initial check for 'token' cookie
    chrome.cookies.get({ url: APP_URL, name: 'token' }, (cookie) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching cookie:", chrome.runtime.lastError.message);
        return;
      }

      const loggedIn = cookie !== undefined && cookie !== null;
      console.log("Updating flag:", loggedIn);

      if (cookie) {
        testToken();
      } else {
        setLoader(false);
        console.warn("Cookie not found, user not logged in.");
      }
    });

    const handleCookieChange = (changeInfo) => {
      const { cookie, removed } = changeInfo;
      if (cookie.domain.includes(APP_DOMAIN) && cookie.name === 'token') {
        const loggedIn = !removed && cookie;
        if (isLoggedIn !== loggedIn) { // Update only if the value has changed
          setIsLoggedIn(loggedIn);
          setLoader(false);
          console.log("isUserLoggedIn updated: 2", loggedIn);
        }
      }
    };

    chrome.cookies.onChanged.addListener(handleCookieChange);

    return () => {
      chrome.cookies.onChanged.removeListener(handleCookieChange);
    };
  }, [setIsLoggedIn, isLoggedIn]); // Add isLoggedIn as dependency to avoid stale closures

  useEffect(() => {
    // Connect to extension
    const port = chrome.runtime.connect({ name: 'sidepanel' });

    port.onMessage.addListener((message) => {
      if (message.type === 'SWITCH_TO_BOT') {
        setCurrentView('bot');
      }
    });

    return () => port.disconnect();
  }, []);

  const handleLogin = () => {
    chrome.tabs.create({ url: `${APP_URL}/login` }, (newTab) => {
      console.log('Opened login in a new tab:', newTab);
    });
  };

  const testToken = async () => {
    try {
      const response = await axiosInstance.get('/testToken');
      setMessage(response.data || 'Token is valid');
    } catch (error) {
      console.error('Error testing token:', error);
      setMessage('Failed to verify token');
    }
  };

  useEffect(() => {
    console.log("isUserLoggedIn updated: ", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="render">
        {loader ?
          (<div className="container text-center mt-5">
            <div className="row mt-5">
              <div className="text-center">
                <div className="loading-spinner">
                  <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon-large" />
                  <p>Authenticating...</p>
                </div>
              </div>
            </div>
          </div>)
          : isLoggedIn ? (
            <div>{currentView === 'bot' ? <Bot /> : <Home />}</div>
          ) : (
            <div className="container text-center mt-5">
              <div className="row mt-5">
                <div className="text-center">
                  <RotatingLogo />
                </div>
                <div className="col-md-12 display-5 fs-1 fw-bold mt-3">Welcome to PsyGenie!</div>
              </div>
              <p className="mt-3 justify-content-center align-items-center fs-5">
                <span className="d-block">Try our Chrome Extension to understand and connect with any human effortlessly.</span>
                <span className="d-block">Analyze their messages for hidden meanings, explore personalized behavioral profiles, and access icebreakers to make every interaction more meaningful.</span>
              </p>
              <button className="btn btn-dark text-white mt-2 fw-bold" onClick={handleLogin}>
                Get Started
              </button>
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
};

export default Sidepanel;
