import React from "react";
import whatsappIcon from "../../assets/img/whatsapp_icon";
import teamsIcon from "../../assets/img/teams_icon";
import linkedinIcon from "../../assets/img/linkedin_icon";
import slackIcon from "../../assets/img/slack_icon";
import gmailIcon from "../../assets/img/gmail_icon";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const communicationApps = [
  { name: "Slack", url: "https://app.slack.com/client", icon: slackIcon },
  { name: "Microsoft Teams", url: "https://teams.live.com/v2", icon: teamsIcon },
  { name: "WhatsApp", url: "https://web.whatsapp.com", icon: whatsappIcon },
  { name: "LinkedIn", url: "https://www.linkedin.com/login", icon: linkedinIcon },
  { name: "Gmail", url: "https://mail.google.com/mail", icon: gmailIcon }
];

const CommunicationAppIcons = () => {
  return (
    <div className="fs-14 text-muted bg-white round-1 shadow-sm">
      <p>Click an app icon below to open the respective communication platform in your browser, then select the messages you want to analyze.</p>
      <div className="fs-14 text-muted brand-icons">
        {communicationApps.map((app, index) => (
          <OverlayTrigger
            key={index}
            placement="top" // Options: "top", "bottom", "left", "right"
            overlay={<Tooltip id="tooltip-div">{app.name}</Tooltip>}
          >
            <a href={app.url} target="_blank"
               rel="noopener noreferrer" className="custom-link px-1">
              <img src={app.icon} width={40} alt={`${app.name} icon`}></img>
            </a>
          </OverlayTrigger>
        ))}
      </div>
    </div>
  );
};

export default CommunicationAppIcons;