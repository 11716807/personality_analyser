import React from 'react';
import PanelLabel from '../PanelLabel/PanelLabel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ImSad2 } from "react-icons/im";
import { useState } from 'react';
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';
import ChannelAccordion from './ChannelAccordion';


const StrengthChallenge = ({ personality }) => {
  return (
    <div className="persona-summary" id="strength-challenge">
      <PanelLabel text="Strength" />
      <p className="fs-6 justify-content-end">{personality.strength}</p>
      <PanelLabel text="Challenge" />
      <p className="fs-6 justify-content-end">{personality.challenges}</p>
    </div>
  );
};
const Guidelines = ({ dos, donts }) => {
  return (
    <div className="persona-guidelines">
      <div className="guidelines-section">
        <PanelLabel text="Do's" />
        <ul>
          {dos.map((item, index) => (
            <li key={index} className="mt-1">
              <i className="fa-regular fa-circle-check text-success"></i> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="guidelines-section">
        <PanelLabel text="Don'ts" />
        <ul>
          {donts.map((item, index) => (
            <li key={index}>
              <i className="fa-regular fa-circle-xmark text-danger"></i> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
const GetToKnowSection = ({ iceBreakers, onIceBreakerClick }) => {
  return (
    <div className="get-to-know-section">
      <PanelLabel text="Get to Know" />
      <ul>
        {iceBreakers.map((iceBreaker, index) => (
          <li key={index} onClick={() => onIceBreakerClick(iceBreaker)}>
            {iceBreaker.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
const FeedbackSection = ({ feedback, setFeedback, handleFeedbackSubmit, submitError, persona, isLoggedInUser }) => {
  return (
    <div className="feedback-section">
      <PanelLabel text="Add Quick Notes" />
      <textarea
        className="feedback-input"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder={
          isLoggedInUser
            ? "Capture quick notes and key insights to stay organized and prepared for future interactions."
            : `Add quick notes about ${persona.fullName} to capture important details like:
- 'Recently faced some health issue'
- 'Dislikes unplanned events'
These insights help our bot provide better, tailored suggestions and ensure smoother conversations.`
        }
        rows={4}
      />
      <div>
         {submitError != "false" && (
             <div className="alert p-2 mt-2 alert-danger">
              <MessageComponent message = {submitError} flag={true} onButtonClick={() => chrome.tabs.create({ url: APP_URL + '/plans/active' })}
               />
          </div>
          )}

       </div>
      <div className="feedback-actions">
        <button className="feedback-submit btn-sm" onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
          Add
        </button>
      </div>
    </div>
  );
};

const OverviewSection = ({ summary, feedback, setFeedback, handleFeedbackSubmit, handleSummaryUpdate, setSummary, submitError, persona , isLoggedInUser}) => {
   return <ChannelAccordion persona = {persona} />;
};


export { StrengthChallenge, Guidelines, GetToKnowSection, FeedbackSection, OverviewSection };
