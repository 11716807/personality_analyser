import React, { useState, useRef } from 'react';
import { axiosInstance } from '../../API/CustomAxiosConfig';
import './ChannelCreator.css';
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';

const ChannelCreator = ({ setShowCreateBox, setChannel, channels }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const hideCreateChannel = async () => {
    setShowCreateBox(false);
  }

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setError('Channel name is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/channels/create', {
        channelName,
        info: description,
      });

      const newChannel = {
        id: response.data.id,
        channelName,
        info: description,
        updatedOn: response.data.updatedOn,
      };

      setChannel([newChannel, ...channels]);
      setShowCreateBox(false);
    } catch (error) {
      console.error('Error creating channel:', error);
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="channel-box">
      <p className="fs-14">Create a channel to analyze user engagement, interactions, and psychological insights</p>
      <div className="form-group">
        <label for="channelNameInput" className="text-muted fs-14">Channel Name</label>
        <input
          type="text"
          id="channelNameInput"
          className="form-control form-control-sm"
          value={channelName}
          placeholder="Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
          required
        />
      </div>

      <div className="form-group mt-2">
        <label for="channelDescriptionInput" className="text-muted fs-14">Description</label>
        <textarea
          id="channelDescriptionInput"
          className="form-control form-control-sm"
          value={description}
          placeholder="Channel Description"
          maxLength="100"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="float-end">
        <button
          className="btn btn-sm btn-secondary mt-3 mx-1"
          disabled={loading}
          onClick={hideCreateChannel}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-orange mt-3 "
          onClick={handleCreateChannel}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
        {error && (
                <div className="alert p-2 mt-2 alert-danger">
                  <MessageComponent
                    message={error}
                    flag={true}
                    onButtonClick={() => chrome.tabs.create({ url: APP_URL + '/plans/active' })}
                  />
                </div>
      )}
      </div>
    </div>
  );
};

export default ChannelCreator;
