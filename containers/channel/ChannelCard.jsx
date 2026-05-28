import React from "react";
import "../Insight/InsightPersonaSelected.css";

const ChannelCard = ({ channelName, generalSummary = "no summary found" , editButton }) => {
  return (
    <div className="mb-0">
      <div className="channel-info mb-0">
        <div className="fs-6 pt-1"><span className="channel-icon text-orange fs-1"><i
          className="fa-solid fa-users"></i></span>
        </div>
        <div className="">
          <span className="text-orange fw-semibold">{channelName}</span>
          <div className="fs-12 text-muted fw-semibold">{generalSummary}</div>
        </div>
      </div>
      <div className="fs-12 text-muted mt-2 ">
        <div className="mb-0 mt-2 text-end">{editButton &&
          <span className="ml-auto me-2 fs-14">{editButton}</span>}
        </div>
      </div>

    </div>
  )
    ;
};

export default ChannelCard;
