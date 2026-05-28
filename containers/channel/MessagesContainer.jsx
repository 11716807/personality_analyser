import React from "react";
import MessageCard from "./MessageCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./MessageCard.css";

const MessagesContainer = ({ messages = [], handleTextSelection, removeMessage, hideButtonPosition, hideButtonRef, hideSelectedText }) => {
  return (
    <div className="messages-container">
      {messages.length > 0 ? (
        <MessageCard
          messages={messages}
          handleTextSelection={handleTextSelection}
          removeMessage={removeMessage}
        />
      ) : (
        <div className="messages-placeholder">
          No message selected. Open the communication app by clicking the icon above, select a message, and add it for analysis.
        </div>
      )}

      {hideButtonPosition?.show && (
        <button
          ref={hideButtonRef}
          className="hide-button"
          style={{
            position: "fixed",
            left: `${hideButtonPosition.x}px`,
            top: `${hideButtonPosition.y}px`,
            transform: "translate(8px, -50%)",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hideSelectedText();
          }}
        >
          <FontAwesomeIcon icon={faEyeSlash} />
        </button>
      )}
    </div>
  );
};

export default MessagesContainer;
