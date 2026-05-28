import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import "./MessageComponent.css";

const MessageComponent = ({ message, flag, onButtonClick }) => {

  const handleSupportClick = () => {
    window.open('mailto:info@psygenie.ai?subject=[Support] - ', '_self');
  };

  const messagesMap = {
    subscription_failed: "Your subscription upgrade was unsuccessful. Please try again.",
    unsubscribed: "You have successfully unsubscribed. Upgrade your plan to regain access.",
    subscription_expired: "Your subscription has expired. Renew now to continue enjoying our services.",
    persona_limit_exhausted_contact_us: "You've reached your persona limit. Contact us at info@psygenie.ai to extend your limit.",
    upgrade_your_plan: "You've reached the trial limit. Upgrade now to unlock more features and exclusive benefits!",
    tokens_exhausted_contact_us: "Your token limit has been reached. Contact us at info@psygenie.ai to increase your limit.",
    existed: "This user already exists.",
    upgrade: "Upgrade your plan to view all profiles.",
    channel_limit_exhausted_contact_us: "You've reached your channel limit. Contact us at info@psygenie.ai to extend your limit.",
    channel_already_exist: "This channel name already exists.",
    upgrade_channel: "upgrade your plan to see or create more channels.",
    invalid_request: "Error processing your request, please recheck all the details and try again",
    invalid_conversation: "Please select a valid conversation. It should involve at least two people."
  };

  return (
    <div className="message-container">
      <p className="message-text">{messagesMap[message] || message }
      </p>
      {flag && messagesMap[message] && !message.includes("contact_us") && !message.includes("invalid_conversation") && !message.includes("exist") && !message.includes("invalid_request") &&  (
        <Button
          variant="secondary"
          onClick={onButtonClick}
          className="upgrade-button"
        >
          Upgrade
        </Button>
      )}
      {flag && messagesMap[message] && message.includes("contact_us") && (
             <Button
               variant="secondary"
               onClick={handleSupportClick}
               className="upgrade-button"
             >
               Contact Us
             </Button>
      )}
    </div>
  );
};


MessageComponent.propTypes = {
  message: PropTypes.string.isRequired,
  flag: PropTypes.bool,
  onButtonClick: PropTypes.func,
};

MessageComponent.defaultProps = {
  flag: false,
};

export default MessageComponent;
