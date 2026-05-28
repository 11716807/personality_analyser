import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import '../Insight/InsightPersonaSelected.css';
import Assistant from './Assistant'
const ChannelSelected = ({ channel, setSelectedChannel ,status, loggedInUserPersona}) => {
  return (
      <>
         <Assistant channel = {channel} status = {status} loggedInUserPersona = {loggedInUserPersona}/>
        <button className="back-button" onClick={() => setSelectedChannel(null)}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </>
  );
};

export default ChannelSelected;
