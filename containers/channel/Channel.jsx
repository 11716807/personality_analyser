import React, { useState } from 'react';
import '../Insight/Insight.css';
import ChannelList from './ChannelList';
import ChannelSelected from './ChannelSelected';
import PanelContainer from '../PanelContainer/PanelContainer';

const Channel = ({ onScreenChange, status, channelSelect , loggedInUserPersona}) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    channelSelect(channel);
  };
  return (
    <PanelContainer>
      <div className="insight-content-wrapper">
        <div className={`slide-container ${selectedChannel ? 'show-selected' : ''}`}>
          <div className={`slide-page ${selectedChannel ? 'hidden' : ''}`}>
            <ChannelList onChannelSelect={handleChannelSelect} onScreenChange={onScreenChange} status={status} />
          </div>
          <div className={`slide-page ${selectedChannel ? '' : 'hidden'}`}>
            {selectedChannel && <ChannelSelected channel={selectedChannel} setSelectedChannel={handleChannelSelect} status={status} loggedInUserPersona = {loggedInUserPersona}/>}
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
export default Channel;
