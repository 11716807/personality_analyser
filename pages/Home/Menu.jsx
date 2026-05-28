import React, { useState, useEffect } from 'react';
import {NavLink, OverlayTrigger, Tooltip} from 'react-bootstrap';
import logo from '../../assets/img/logo.svg';
import { useAuth } from '../Auth/AuthContext';
import { APP_URL } from '../../API/Config/AppConfig';
import { axiosInstance, setupAxiosInterceptor } from '../../API/CustomAxiosConfig';

const InsightMenuItem = ({ handleMenuClick, onScreenChange}) => {
    const { isPersonalProfileGenerated} = useAuth();
  return (
    <OverlayTrigger
      placement="right" // Options: "top", "bottom", "left", "right"
      overlay={<Tooltip id="tooltip-div">
        Browse through personalities
      </Tooltip>}
    >
      <li
        className={`pg-menu ${isPersonalProfileGenerated ? '' : 'disabled'}`}
        onClick={(event) => {
          handleMenuClick(event, 'Insights');
          onScreenChange('insight');
        }}
      >
          <NavLink to="#">
            <i
              className="fa-solid fa-handshake-angle fs-6"
              title="Insights"
            ></i>
          </NavLink>
      </li>
    </OverlayTrigger>
  );
};

const AddMemberMenuItem = ({ handleMenuClick, onScreenChange }) => {
    const { isPersonalProfileGenerated} = useAuth();
  return (
    <OverlayTrigger
      placement="right" // Options: "top", "bottom", "left", "right"
      overlay={<Tooltip id="tooltip-div">Add a new personality</Tooltip>}
    >
      <li className={`pg-menu ${isPersonalProfileGenerated ? '' : 'disabled'}`}
        onClick={(event) => {
          handleMenuClick(event, 'Add Members');
          onScreenChange('addmember');
        }}
      >
        <NavLink to="#">
          <i
            className="fa-solid fa-user-plus fs-6"
            title="Add Members"
          ></i>
        </NavLink>
      </li>
    </OverlayTrigger>
  );
};

const ChannelMenuItem = ({ handleMenuClick, onScreenChange }) => {
  const { isPersonalProfileGenerated } = useAuth();
  return (
  <OverlayTrigger
          placement="right" // Options: "top", "bottom", "left", "right"
          overlay={<Tooltip id="tooltip-div">Analyze group chats channels</Tooltip>}
        >
    <li
      className={`pg-menu ${isPersonalProfileGenerated ? '' : 'disabled'}`}
      onClick={(event) => {
        handleMenuClick(event, 'Channels');
        onScreenChange('channels');
      }}
    >
      <NavLink to="#">
        <i
          className="fa-solid fa-users fs-6"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Channels"
        ></i>
      </NavLink>
    </li>
  </OverlayTrigger>
  );
};

const AssistantMenuItem = ({ handleMenuClick, onScreenChange }) => {
    const { isPersonalProfileGenerated} = useAuth();
  return (
    <OverlayTrigger
      placement="right" // Options: "top", "bottom", "left", "right"
      overlay={<Tooltip id="tooltip-div">PsyGenie’s AI-powered assistant</Tooltip>}
    >
      <li id="bot-li-item" className={`pg-menu ${isPersonalProfileGenerated ? '' : 'disabled'}`}
        onClick={(event) => {
          handleMenuClick(event, 'PsyGenie Assistant');
          onScreenChange('bot');
        }}
      >
        <NavLink to="#">
          <i
            className="fa-solid fa-robot fs-6"
            title="PsyGenie Assistant"
          ></i>
        </NavLink>
      </li>
    </OverlayTrigger>
  );
};

const UserSettingMenuItem = ({ handleMenuClick, onScreenChange }) => {
    const { isPersonalProfileGenerated} = useAuth();
  return (
    <OverlayTrigger
      placement="right" // Options: "top", "bottom", "left", "right"
      overlay={<Tooltip id="tooltip-div">Account details</Tooltip>}
    >
      <li className={`pg-menu ${isPersonalProfileGenerated ? '' : 'disabled'}`}
        onClick={(event) => {
          handleMenuClick(event, 'User Setting');
          onScreenChange('settings');
        }}
      >
        <NavLink to="#">
          <i className="fa-solid fa-user-gear fs-6" data-bs-toggle="tooltip" data-bs-placement="top" title="Setting"></i>
        </NavLink>
      </li>
    </OverlayTrigger>
  );
};

const MenuItems = ({ handleMenuClick, onScreenChange }) => {
  return (
    <>
      <InsightMenuItem handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />
      <AddMemberMenuItem handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />
      <ChannelMenuItem handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />
      <AssistantMenuItem handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />
      <UserSettingMenuItem handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />
    </>
  );
};

const Menu = ({ onScreenChange }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [message, setMessage] = useState('');
  const [loader , setLoader] = useState(true);

  useEffect(() => {
    setupAxiosInterceptor(setIsLoggedIn, isLoggedIn, setLoader);
    chrome.cookies.get({ url: APP_URL, name: 'token' }, (cookie) => {
      console.log('Cookie fetched:', cookie);

      if (cookie && cookie.value) {
        console.log('Cookie update - ', cookie);
        testToken();
      } else {
        console.log("Change flag to false");
        setIsLoggedIn(false); // No token found, user is logged out
        setLoader(false);
      }
    });
  }, []);

  const closeExtension = () => {
    window.close();
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

  const handleMenuClick = (event, message) => {
    console.log(message);
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
    event.currentTarget.classList.add('active');
  };

  return (
    <section className="" id="Menu">
      <div className="main_menu text-center">
        <ul>
          <li className="header-logo">
            <img src={logo} alt="PsyGenie" width="30px" />
          </li>
          <OverlayTrigger
            placement="right" // Options: "top", "bottom", "left", "right"
            overlay={<Tooltip id="tooltip-div">Understand your personality</Tooltip>}
          >
            <li
              className="pg-menu active" data-title="myprofile"
              onClick={(event) => {
                handleMenuClick(event, 'My Personality');
                onScreenChange('my_profile');
              }}
            >
              <NavLink to="/">
                <i
                  className="fa-solid fa-circle-user fs-6"
                  title="My Personality"
                ></i>
              </NavLink>
            </li>
          </OverlayTrigger>
          {isLoggedIn && <MenuItems handleMenuClick={handleMenuClick} onScreenChange={onScreenChange} />}
          <OverlayTrigger
            placement="right" // Options: "top", "bottom", "left", "right"
            overlay={<Tooltip id="tooltip-div">Close this Side Panel</Tooltip>}
          >
            <li className="pg-menu" onClick={() => closeExtension()}>
              <NavLink to="#">
                <i
                  className="fa-solid fa-xmark fs-6"
                  title="Close Side Panel"
                ></i>
              </NavLink>
            </li>
          </OverlayTrigger>
        </ul>
      </div>
    </section>
  );
};
export default Menu;
