import React, { useEffect, useState } from 'react';
import { fetchPersonaList } from '../../API/persona/PersonaAPI';
import PanelLabel from '../PanelLabel/PanelLabel';
import '../Insight/InsightPersonaList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import ImageComponent from '../../components/ImageComponent';
import ErrorModal from '../Modal/ErrorModal';
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';
import { GrChannel } from "react-icons/gr";
import ChannelCreator from "./ChannelCreator";
import { axiosInstance } from '../../API/CustomAxiosConfig';
import { formatDate } from '../../API/DateFormater';
import channelIcon from "../../assets/img/channel-icon";
import NotificationBar from "../../pages/addmember/NotificationBar";

const ChannelList = ({ onChannelSelect, onScreenChange, status }) => {
  const [channel, setChannel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const [showCreateBox, setShowCreateBox] = useState(false); //use this flag to our show that copnent
  const UserGuideURL = APP_URL + "/user-guide"

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      try {
      const response = await axiosInstance.get('/channels/channels');
      setChannel(response.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };
    loadChannels();
  }, []);

  const handleMenuClick = (event, message) => {
    console.log(message);
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
  };


const filteredChannels = channel.filter(
      (item) =>
        item.channelName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Flag to control conditional rendering
  const isLimitedView = status?.[1]?.toUpperCase() === 'PGFREE';
  const currentStatus = status?.[0]?.toUpperCase() !== 'ACTIVE';
  const size = channel?.length;

  return (
    <>
      {channel.length == 0 && !loading &&
        (
          <div className="demo-notification-bar">
            <NotificationBar
            message="New to channels? 🎥 Watch this quick guide!"
            link={UserGuideURL}/>
          </div>
        ) }
            <div className={`p-2`}>
            <PanelLabel text="Analyse Individuals In Group Chats" />
        <div>
            Create channel to analyze individual roles and behaviors in group chats.
          </div>
        <div className="insight-search-container">
          <div className="search-container">
            <input
              type="text"
              className="form-control"
              placeholder="Search Channels"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <div
            onClick={() => setShowCreateBox(true)}
            className="fs-1 cursor-pointer"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Add Channel"
          >
            <i className="fa-regular fa-square-plus fs-1 panel-label"></i>
          </div>
        </div>
        <div className="channel-list">
          {showCreateBox ? (
            <ChannelCreator
              setShowCreateBox={setShowCreateBox}
              channels={channel}
              setChannel={setChannel}
            />
          ) : null}
          {loading ? (
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon" />
            </div>
          ) : (
            <>
              {((isLimitedView && size >= 5) || currentStatus) ? (
                // Show only 5 personas with blurred background
                  <>
                    <div className="limited-view-container">
                      {filteredChannels.slice(0, 5).map((channel) => (
                        <div key={channel.id} className="channel-card" onClick={() => onChannelSelect(channel)}>
                          <div className="">
                            <div className="channel-info">
                              <div className="fs-6 pt-1"><span className="channel-icon text-orange fs-1"><i
                                className="fa-solid fa-users"></i></span>
                              </div>
                              <div className="">
                                <span className="text-orange fw-semibold">{channel.channelName}</span>
                                <div className="fs-12 text-muted fw-semibold">{channel.info}</div>
                                <div className="fs-12 text-info-emphasis">
                                  Updated on {formatDate(channel.updatedOn)}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                    <div>
                      <MessageComponent message="upgrade_channel" flag={true}
                                        onButtonClick={() => chrome.tabs.create({url: APP_URL + '/plans/active'})}/>
                    </div>
                  </>
              ) : filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (

                  <div key={channel.id} className="channel-card" onClick={() => onChannelSelect(channel)}>
                    <div className="">
                    <div className="channel-info">
                        <div className="fs-6 pt-1"><span className="channel-icon text-orange fs-1"><i
                          className="fa-solid fa-users"></i></span>
                        </div>
                        <div className="">
                          <span className="text-orange fw-semibold">{channel.channelName}</span>
                          <div className="fs-12 text-muted fw-semibold">{channel.info}</div>
                          <div className="fs-12 text-info-emphasis">
                            Updated on {formatDate(channel.updatedOn)}
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ))
              ) : (
                <div className="empty-message">No Channels found.</div>
              )}
            </>
          )}
        </div>
        <ErrorModal
          isOpen={showError}
          onClose={() => setShowError(false)}
          errorMessage="We're having trouble loading your channels."
          networkIssue={true}
          sticky={true}
        />
      </div>
    </>
  );
};

export default ChannelList;
