import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../API/CustomAxiosConfig'; // Ensure this is the correct axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEyeSlash, faCircleNotch, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../Bot/Bot.css';
import PanelLabel from '../PanelLabel/PanelLabel';
import UserInfoDisplay from "./UserInfoDisplay";
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';
import MessagesContainer from "./MessagesContainer";
import CommunicationAppIcons from "../Bot/CommunicationAppIcons";
import NotificationBar from "../../pages/addmember/NotificationBar";


const Assistant = ({channel, status, loggedInUserPersona}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [hideButtonPosition, setHideButtonPosition] = useState({ show: false, x: 0, y: 0 });
  const hideButtonRef = useRef(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [response, setResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [error , setError] = useState('')
  const [loader , setLoader] = useState(false);
  const [manualInputEnabled, setManualInputEnabled] = useState(false);
  const [manualText, setManualText] = useState("");
  const isLimitedView = status?.[1]?.toUpperCase() === 'PGFREE';
  const UserGuideURL = APP_URL + "/user-guide"
    const fetchChannelData = async () => {
      console.log("loggedInUserPersona : {}", loggedInUserPersona);
      setError(null);
      try {
        const { data } = await axiosInstance.get(`/channels/info/${channel.channelName}`);
        console.log("channel data : {}", data);
        if(data.channelRuns && data.channelRuns.length > 0){
            setResponse(data);
            setShowResponse(true);
        }
       setLoader(false);
      } catch (err) {
        setError("Failed to fetch channel data");
        setLoader(false);
        setShowResponse(false);
      } finally {

      }
    };

  useEffect(() => {
    setLoader(true);
    fetchChannelData();
  }, [channel.channelName]);

const handleSubmit = async () => {
  // Ensure at least one input is provided before proceeding
  if (messages.length === 0 && manualText.trim().length === 0) {
    alert('Please ensure you have:\n- Selected messages\n- Entered additional text\n- Selected an action');
    return;
  }

  // Update messages if manual text is entered
  if (manualText.trim().length !== 0) {
    setMessages(prev => [...prev, { content: manualText }]); // Preserve previous messages
  }

  setResponse(response);
  setShowResponse(true);
  localStorage.setItem(channel.channelName, "true");

  try {
    const { data } = await axiosInstance.post('/channels/analyze', {
      channelName: channel.channelName,
      text: [...messages, { content: manualText }] // Ensure the latest messages are used
        .map(message => message.content)
        .join("\n")
    });

    console.log('[PsyGenie] [Bot] [DEBUG] Got response:', data); // Fixed logging to use correct response
    fetchChannelData();
    localStorage.setItem(channel.channelName, "false");
  } catch (error) {
    localStorage.setItem(channel.channelName, "false");
    console.error('[PsyGenie] [Bot] [ERROR] Failed to get response:', error);
    setError(error.response?.data?.message || 'An unexpected error occurred');
    if (typeof error.response?.data === "string" && error.response.data.includes("LLM response format is incorrect")) {
       setError("invalid_conversation");
    }
  }
};

  const handleBack = () => {
    setShowResponse(false);
    setInputText('');
    setMessages([]);
    setManualText('');
    setManualInputEnabled(false);
  };

  const removeMessage = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  const handleNewMessage = (message) => {
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages, message];
                return newMessages;
            });
     };

  const handleTextSelection = (messageId) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setSelectedMessageId(messageId);
      setHideButtonPosition({
        show: true,
        x: rect.right + window.scrollX,
        y: rect.top + window.scrollY,
      });
    } else {
      setHideButtonPosition({ show: false, x: 0, y: 0 });
    }
  };

  const hideSelectedText = () => {
    if (selectedText && selectedMessageId) {
      setMessages(
        messages.map((message) => {
          if (message.id === selectedMessageId) {
            const regex = new RegExp(selectedText, 'g');
            const newContent = message.content.replace(regex, '***');
            return {
              ...message,
              content: newContent,
            };
          }
          return message;
        })
      );
      setSelectedText('');
      setSelectedMessageId(null);
      setHideButtonPosition({ show: false, x: 0, y: 0 });
      window.getSelection().removeAllRanges();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hideButtonRef.current && !hideButtonRef.current.contains(event.target)) {
        setHideButtonPosition({ show: false, x: 0, y: 0 });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('[PsyGenie] [Bot] [INFO] Bot component mounted');
    // Connect to extension
    const port = chrome.runtime.connect({ name: 'assistant-panel' });
    // Listen for messages
    const messageListener = async (message) => {
      setManualInputEnabled(false);
      console.log('[PsyGenie] [Bot] [DEBUG] Received message through port:', message);
      if (message.type === 'PSYGENIE_CHANNEL_MESSAGE_EVENT') {
        handleNewMessage({
          id: Date.now(),
          content: message.message,
        });
      }
    };
    port.onMessage.addListener(messageListener);
    return () => {
      console.log('[PsyGenie] [Bot] [INFO] Bot component unmounting');
      port.onMessage.removeListener(messageListener);
      port.disconnect();
    };
  }, []);
  useEffect(() => {
    console.log('[PsyGenie] [Bot] [DEBUG] Messages state updated:', messages);
  }, [messages]);

  const changeInputEnable = () => {
      setMessages([]);
      setManualText("");
      setManualInputEnabled(!manualInputEnabled)
  };

return (
  <>
    {loader ? (
      <div className="loading-spinner">
        <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon" />
      </div>
    ) : (
      <>
      {!showResponse && (
        <>
        {!response?.channelRuns &&
          (
            <div className="demo-notification-bar p-0"><NotificationBar
              message="How to do analysis? Click here to watch and learn!"
              link={UserGuideURL}
            /></div>) }
        </>
        )}
      <div className="bot-content-wrapper p-2">
        {!showResponse && (
          <>
            <div className="page-header">
            <div className="page-header-text">
              <PanelLabel text="Conversation Analysis with PsyGenie" />
            </div>
          </div>
          </>
        )}

        <div className={`bot-content ${showResponse ? "show-response" : ""}`}>
          <div className="input-section">
            <CommunicationAppIcons />

            {/* Toggle Switch for Manual Input */}
            <div className="mb-2 mt-2">
              <div>
                <label className="form-check-label me-2 text-orange fw-bold">Messages</label>
              </div>
              <div className="d-flex form-check gap-2 fs-14 p-0 mt-2">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="manualInputToggle"
                         id="manualInputToggle1" onClick={() => changeInputEnable(false)} onChange={() => {
                  }} checked={!manualInputEnabled}/>
                  <label className="form-check-label" htmlFor="manualInputToggle1">
                    Add from Apps
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="manualInputToggle"
                         id="manualInputToggle2" onClick={() => changeInputEnable(true)} onChange={() => {
                  }} checked={manualInputEnabled}/>
                  <label className="form-check-label" htmlFor="manualInputToggle2">
                    Paste Manually
                  </label>
                </div>
              </div>
            </div>

            {/* Conditionally show MessagesContainer or Textbox */}
            {!manualInputEnabled ? (
              <>
                <MessagesContainer
                  messages={messages}
                  handleTextSelection={handleTextSelection}
                  removeMessage={removeMessage}
                  hideButtonPosition={hideButtonPosition}
                  hideButtonRef={hideButtonRef}
                  hideSelectedText={hideSelectedText}
                />
              </>
            ) : (
              <textarea
                className="form-control mt-2"
                placeholder="Paste your text here..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                rows={4}
              />
            )}

            <div className="fs-10 text-muted text-end">Max 10K characters allowed</div>

            {error && (
              <div className="alert p-2 mt-2 alert-danger">
                <MessageComponent
                  message={error}
                  flag={true}
                  onButtonClick={() => chrome.tabs.create({url: APP_URL + "/plans/active"})}
                />
              </div>
            )}

            <div className="text-end">
              <button className="bot-submit btn btn-warning btn-orange mt-3" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faCircleNotch} spin style={{marginRight: "8px"}}/> Analysing...
                  </>
                ) : (
                  "Analyse"
                )}
              </button>
            </div>
          </div>

          {showResponse && (
            <div className="response-section">
              <div className="response-container">
                <UserInfoDisplay
                  response={response}
                  editButton={
                    isLimitedView && response?.channelRuns?.length >= 5 ? null : (
                      <button onClick={handleBack} className="btn btn-sm btn-outline-orange rounded-1">
                        <i className="fas fa-edit" />
                        &nbsp;Rerun Analysis
                      </button>
                    )
                  }
                  channel={channel}
                  loggedInUserPersona={loggedInUserPersona}
                  newError = {error}
                />
              </div>
            </div>
          )}
        </div>
      </div></>
    )}
  </>
);
};

export default Assistant;
