import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MessageList = ({ messages, setMessages }) => {
  const removeMessage = (id) => {
    setMessages((prevMessages) => prevMessages.filter(message => message.id !== id));
  };

  return (
    <>
      <div className="fs-14 fw-semibold text-orange mt-2"></div>
      <div className="messages-container mt-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <>
            <div key={message.id} className="message-card">
              <div className="message-content">{message.content}</div>
              <button className="remove-button" onClick={() => removeMessage(message.id)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            </>
          ))
        ) : (
          <div className="messages-placeholder">
            No message selected. Open the communication app by clicking the icon above, select a message, and add it for analysis.
          </div>
        )}
      </div>
      {messages.length > 0 ? (
        <div className="fs-10 text-muted text-end">Max 1K characters allowed</div>
        ):(<></>)}
        </>
        );
      };

      export default MessageList;