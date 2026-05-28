import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./MessageCard.css";

const MessageCard = ({ messages = [], handleTextSelection, removeMessage }) => {
  const [expanded, setExpanded] = useState(false);

  const combinedMessage = messages.map((msg) => msg.content).join("\n");
  const shortMessage = combinedMessage.slice(0, 250) + (combinedMessage.length > 250 ? "..." : "");

  return (
    <div className="message-card">
      <div
        className={`message-content ${expanded ? "expanded" : "collapsed"}`}
        onMouseUp={() => handleTextSelection(messages[0]?.id)}
      >
        {expanded ? combinedMessage : shortMessage}
      </div>

      {combinedMessage.length > 250 && (
        <button className="view-toggle" onClick={() => setExpanded(!expanded)}>
          <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
        </button>
      )}

      <button className="remove-button" onClick={() => removeMessage(messages[0]?.id)}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default MessageCard;
