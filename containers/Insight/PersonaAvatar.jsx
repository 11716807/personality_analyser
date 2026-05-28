import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import handleSpeak from './HandleSpeak';
import './InsightPersonaSelected.css';
import ImageComponent from '../../components/ImageComponent';

const PersonaAvatar = ({ persona = {}, pronunciation = null, setShowPronunciation = () => {}, personality = {} }) => {
  // Debugging: Log incoming props to verify their structure
  console.log('PersonaAvatar props:', { persona, pronunciation, personality });

  return (
    <div className="profile-card">
      <ImageComponent name={persona?.username || 'Unknown'} className="persona-avatar" />
      <div className="persona-info">
        <div className="mb-0 m-1">
          <div className="fs-14 fw-bold profile-card-name">
            {persona?.fullName || 'No Name Provided'}
            {pronunciation && (
              <FontAwesomeIcon
                icon={faVolumeUp}
                className="fs-10 persona-name-speaker"
                onClick={() => {
                  const ssmlContent =
                    pronunciation.ssml ||
                    `<speak><prosody rate="medium"><lang xml:lang="${pronunciation.lang}">${persona?.fullName || 'No Name Provided'}</lang></prosody></speak>`;
                  const ssml = `<?xml version="1.0"?>${ssmlContent}`;
                  handleSpeak(ssml, pronunciation.lang);
                }}
              />
            )}
          </div>
          {pronunciation && pronunciation.breakdown && (
            <div className="persona-username">
              <a
                className="fs-12 persona-name-read text-info-emphasis"
                onClick={() => setShowPronunciation(true)}
                style={{
                  color: 'black',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#9d4400')}
                onMouseLeave={(e) => (e.target.style.color = 'black')}
              >
                {pronunciation.breakdown}
              </a>
            </div>
          )}
          {personality?.name && <div className="persona-personality-name fs-12">{personality.name}</div>}
          {personality?.relation && personality.relation !== 'me' ? (
            <p className="persona-username persona-username-label">{personality.relation}</p>
          ) : null}
        </div>
      </div>
      <hr className="separator" />
    </div>
  );
};

export default PersonaAvatar;
