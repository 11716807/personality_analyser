import React, { useState, useEffect, useRef } from 'react';
import { faSlack, faMicrosoft, faGoogle, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PanelContainer from '../PanelContainer/PanelContainer';
import MessageList from './MessageList';
import UserList from './UserList';
import BotInput from './BotInput';
import BotResponse from './BotResponse';
import { ask } from '../../API/bot/BotAPI';
import { fetchPersonaList } from '../../API/persona/PersonaAPI';
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import PanelLabel from '../PanelLabel/PanelLabel';
import StrategySelectorPanel from "./StrategySelectorPanel"; // Import new component
import NoStrategySelected from "./NoStrategySelected"; // Import new "No strategy selected" component
import CommunicationAppIcons from "./CommunicationAppIcons";
import InfoBox from "./InfoBox";  // Import InfoBox separately
import TacticSelector from "./TacticSelector";  // Import TacticSelector separately
import SubmitButton from "./SubmitButton";  // Import SubmitButton separately
import NotificationBar from "../../pages/addmember/NotificationBar";
import {APP_URL} from "../../API/Config/AppConfig";



const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [detectedUsers, setDetectedUsers] = useState([]);
  const [predefinedUsers, setPredefinedUsers] = useState([]);
  const [response, setResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState("None"); // Track selected strategy
  const [inputText, setInputText] = useState("");  // State for input text
  const [selectedOption, setSelectedOption] = useState("resolve_conflict");  // State for selected option
  const [manualInputEnabled, setManualInputEnabled] = useState(false);
  const [manualText, setManualText] = useState("");
  const UserGuideURL = APP_URL + "/user-guide"


  const predefinedUsersRef = useRef([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const personaList = await fetchPersonaList();
        setPredefinedUsers(personaList.map((persona) => persona.fullName));
        predefinedUsersRef.current = personaList.map((persona) => persona.fullName.toLowerCase()); // Store for reference
      } catch (error) {
        console.error('Error fetching persona list:', error);
      }
    };
    fetchPersonas();
  }, []);

  // Function to detect users from message content
  const searchUsers = (messageContent) => {
    if (!messageContent || messageContent.trim() === '') return [];

    try {
      const cleanContent = messageContent
        .replace(/\n/g, ' ') // Remove newlines
        .replace(/[^\w\s]/g, '') // Remove special characters
        .toLowerCase();

      const searchTerms = cleanContent.split(' ').filter(Boolean);

      const matchedUsers = predefinedUsersRef.current.filter((user) =>
        searchTerms.some((term) => user.split(' ').includes(term))
      );

      return matchedUsers;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    }
  };

 const handleNewMessage = (message) => {
     // Process the message content to split at user-timestamp lines
     const lines = message.content.split('\n');
     const users = searchUsers(message.content);

     let currentMessageLines = [];
     const messages = [];

     lines.forEach((line, index) => {
       const trimmedLine = line.trim();
       const cleanLine = trimmedLine.toLowerCase().replace(/[^\w\s]/g, '');

       // Check if line matches pattern: username followed by time
       const timePattern = /\d{1,2}:\d{2}\s*(?:AM|PM)/i;
       const hasTimeStamp = timePattern.test(trimmedLine);

       // Check for reply count pattern (e.g., "2 replies")
       const replyCountPattern = /^\d+\s+repl(y|ies)$/i;

       // Check for "Last reply" patterns with various timestamp formats
       const threadViewPattern = /^last reply(?:.*?ago|.*?at \d{1,2}:\d{2}\s*(?:AM|PM)).*?view thread$/i;

       // Check if this line should be filtered out
       const isUserLine = users.some((user) => {
         const cleanUser = user.toLowerCase();
         // Check if line is exactly the user name
         if (cleanLine === cleanUser) return true;

         // Check if line starts with user name and has timestamp
         if (hasTimeStamp && cleanLine.startsWith(cleanUser)) {
           const afterUser = trimmedLine.slice(user.length).trim();
           return timePattern.test(afterUser);
         }

         return false;
       });

       const isReplyLine = replyCountPattern.test(cleanLine);
       const isThreadViewLine = threadViewPattern.test(trimmedLine.toLowerCase());

       if (isUserLine || isReplyLine || isThreadViewLine) {
         // If we have accumulated lines, create a new message
         if (currentMessageLines.length > 0) {
           const messageContent = currentMessageLines.join('\n').trim();
           if (messageContent) {
             // Only add non-empty messages
             messages.push({
               ...message,
               content: messageContent,
             });
           }
           currentMessageLines = [];
         }
       } else {
         currentMessageLines.push(line);
       }

       // Handle the last group of lines
       if (index === lines.length - 1 && currentMessageLines.length > 0) {
         const messageContent = currentMessageLines.join('\n').trim();
         if (messageContent) {
           // Only add non-empty messages
           messages.push({
             ...message,
             content: messageContent,
           });
         }
       }
     });

     // If no splits occurred, use the original trimmed message
     const messagesToAdd =
       messages.length > 0
         ? messages
         : [
             {
               ...message,
               content: message.content.trim(),
             },
           ];

     setMessages((prevMessages) => [...prevMessages, ...messagesToAdd]);
 };

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'bot-panel' });

    port.onMessage.addListener(async (message) => {
      setManualInputEnabled(false);
      console.log('[PsyGenie] [Bot] [DEBUG] Received message:', message);

      if (message.type === 'SWITCH_TO_BOT_SCREEN') {
        console.log('[PsyGenie] [Bot] [INFO] Switching to bot screen');
        // Ensure bot panel is shown
        setShowResponse(false); // Hide response panel if open
      }

      if (message.type === 'PSYGENIE_ADD_MESSAGE_EVENT' && message.message) {
        console.log('[PsyGenie] [Bot] [INFO] New message added, updating UI.');
        handleNewMessage({ id: Date.now(), content: message.message });
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  const changeInputEnable = (enableInput) => {
        console.log("event.target.value -->" + event.target.value);
        setMessages([]);
        setManualText("");
        setManualInputEnabled(enableInput)
  };

  const changeMessageForTextBox = (value) => {
      console.log("valueee: {}", value);
      setManualText(value);
      setMessages(prev => [...prev, { content: value }]);
  };

  const handleSubmit = async (inputText, selectedOption, selectedStrategies) => {

  if (selectedStrategy === "lsm") {
      selectedOption = "lsm"; // Automatically set selectedOption to "lsm"
      if (!inputText.trim()){
            alert("Please enter your response which needs to be linguistically matched with target");
            return;
      }
    }

    if (selectedStrategy === "intent") {
          selectedOption = "intent"; // Automatically set selectedOption to "lsm"
     }
    setLoading(true);
    try {
      const response = await ask(messages, inputText, selectedOption, detectedUsers);
      setResponse(response);
      setShowResponse(true);
      setMessages([]);
                setInputText("");
                setSelectedOption("resolve_conflict"); // Reset to default
                setDetectedUsers([]);
    } catch (error) {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    } finally {

          setLoading(false);
    }
  };

  return (
    <PanelContainer>
      <div className="demo-notification-bar">
        <NotificationBar id="demoNotificationBar"
          message="How to use the Assistant? Click here to watch and learn!"
          link={UserGuideURL}
        />
      </div>
      <div className="bot-content-wrapper p-2">
        {/* Heading */}
        <div className="page-header-text">
          <PanelLabel text="Real-Time Assistance with PsyGenie" />
        </div>
         {!showResponse && (
             <StrategySelectorPanel
               selectedStrategy={selectedStrategy}
               setSelectedStrategy={setSelectedStrategy}
             />
           )}

        {/* If No Strategy is Selected, Show Message */}
              {selectedStrategy === "None" ? (
                        <>
                          {messages.length === 0 ? (
                            <NoStrategySelected />
                          ) : (
                            <MessageList messages={messages} setMessages={setMessages} />
                          )}
                        </>
                      ) : (
                        !showResponse && (
                          <>
                            {/* Section for "Tactic" Strategy */}
                            {selectedStrategy === "tactic" && (
                              <>
                                    <CommunicationAppIcons/>
                                     <div className="mb-2 mt-2">
                                       <div>
                                        <label className="form-check-label me-2 text-orange fw-bold">Messages</label>
                                       </div>
                                       <div className="d-flex form-check gap-2 fs-14 p-0 mt-2">
                                         <div className="form-check">
                                           <input className="form-check-input" type="radio" name="manualInputToggle"
                                                  id="manualInputToggle1" onClick={() => changeInputEnable(false)} onChange={() => {}} checked={!manualInputEnabled}/>
                                           <label className="form-check-label" htmlFor="manualInputToggle1">
                                             Add from Apps
                                           </label>
                                         </div>
                                         <div className="form-check">
                                           <input className="form-check-input" type="radio" name="manualInputToggle"
                                                  id="manualInputToggle2" onClick={() => changeInputEnable(true)} onChange={() => {}}  checked={manualInputEnabled}/>
                                           <label className="form-check-label" htmlFor="manualInputToggle2">
                                             Paste Manually
                                           </label>
                                         </div>
                                       </div>
                                     </div>
                                {!manualInputEnabled ?
                                  (<MessageList messages={messages} setMessages={setMessages}/>) :
                                  (
                                    <textarea
                                      className="form-control mt-2"
                                      placeholder="Paste your text here..."
                                      value={manualText}
                                      onChange={(e) => changeMessageForTextBox(e.target.value)}
                                      rows={4}
                                      />
                                   )
                                }
                                {messages.length > 0 && (
                                  <>
                                    <UserList detectedUsers={detectedUsers} setDetectedUsers={setDetectedUsers}
                                              predefinedUsers={predefinedUsers}/>
                                    <InfoBox inputText={inputText} setInputText={setInputText} loading={loading} selectedStrategy={selectedStrategy} />
                                    <TacticSelector selectedOption={selectedOption}
                                                    setSelectedOption={setSelectedOption} loading={loading}/>
                                    <SubmitButton handleSubmit={handleSubmit} inputText={inputText}
                                                  selectedOption={selectedOption} selectedStrategy={selectedStrategy}
                                                  loading={loading}/>
                                  </>
                                )}
                              </>
                            )}

                            {/* Section for "LSM" Strategy */}
                            {selectedStrategy === "lsm" && (
                              <>
                                <CommunicationAppIcons/>
                                <div className="mt-2 mb-2">
                                  <div>
                                    <label className="form-check-label me-2 text-orange fw-bold">Messages</label>
                                  </div>
                                  <div className="d-flex form-check gap-2 fs-14 p-0 mt-2">
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="manualInputToggle"
                                             id="manualInputToggle1" onClick={() => changeInputEnable(false)}
                                             onChange={() => {
                                             }} checked={!manualInputEnabled}/>
                                      <label className="form-check-label" htmlFor="manualInputToggle1">
                                        Add from Apps
                                      </label>
                                    </div>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="manualInputToggle"
                                             id="manualInputToggle2" onClick={() => changeInputEnable(true)}
                                             onChange={() => {
                                             }} checked={manualInputEnabled}/>
                                      <label className="form-check-label" htmlFor="manualInputToggle2">
                                        Paste Manually
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                {!manualInputEnabled ?
                                  (<MessageList messages={messages} setMessages={setMessages}/>) :
                                  (
                                    <textarea
                                      className="form-control mt-2"
                                      placeholder="Paste your text here..."
                                      value={manualText}
                                      onChange={(e) => changeMessageForTextBox(e.target.value)}
                                      rows={4}
                                    />
                                  )
                                }
                                {messages.length > 0 && (
                                  <>
                                    <InfoBox inputText={inputText} setInputText={setInputText} loading={loading}
                                             selectedStrategy={selectedStrategy}/>
                                    <SubmitButton handleSubmit={handleSubmit} inputText={inputText}
                                                  selectedOption={selectedOption} selectedStrategy={selectedStrategy}
                                                  loading={loading}/>
                                  </>
                                )}
                              </>
                            )}

                              {/* Section for "Intent" Strategy */}
                              {selectedStrategy === "intent" && (
                                <>
                                  <CommunicationAppIcons/>
                                  <div className="mt-2 mb-2">
                                    <div>
                                      <label className="form-check-label me-2 text-orange fw-bold">Messages</label>
                                    </div>
                                    <div className="d-flex form-check gap-2 fs-14 p-0 mt-2">
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="manualInputToggle"
                                               id="manualInputToggle1" onClick={() => changeInputEnable(false)}
                                               onChange={() => {
                                               }} checked={!manualInputEnabled}/>
                                        <label className="form-check-label" htmlFor="manualInputToggle1">
                                          Add from Apps
                                        </label>
                                      </div>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" name="manualInputToggle"
                                               id="manualInputToggle2" onClick={() => changeInputEnable(true)}
                                               onChange={() => {
                                               }} checked={manualInputEnabled}/>
                                        <label className="form-check-label" htmlFor="manualInputToggle2">
                                          Paste Manually
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {!manualInputEnabled ?
                                    (<MessageList messages={messages} setMessages={setMessages}/>) :
                                    (
                                      <textarea
                                        className="form-control mt-2"
                                        placeholder="Paste your text here..."
                                        value={manualText}
                                        onChange={(e) => changeMessageForTextBox(e.target.value)}
                                        rows={4}
                                      />
                                    )
                                  }
                                  {messages.length > 0 && (
                                    <SubmitButton handleSubmit={handleSubmit} inputText={inputText}
                                                  selectedOption={selectedOption} selectedStrategy={selectedStrategy}
                                                  loading={loading}/>
                                  )}
                                </>
                              )}
                          </>
                        )
              )}

        {error && <MessageComponent message={error} flag={true}/>}
        {showResponse && <BotResponse response={response} setShowResponse={setShowResponse}/>}
      </div>
    </PanelContainer>
  );
};

export default Bot;