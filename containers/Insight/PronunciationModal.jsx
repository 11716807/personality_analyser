import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customModalStyles } from './PersonaSelectedCss';
import { faXmarkSquare } from '@fortawesome/free-solid-svg-icons';

const PronunciationModal = ({ isOpen, onClose, pronunciation, personaName }) => {
  if (!pronunciation) return null;
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles} contentLabel="Pronunciation Guide">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${require('../../assets/img/talk.png')})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
          zIndex: -1,
        }}
      />
      <div className="back-section">
        <FontAwesomeIcon
          className="back-button"
          icon={faXmarkSquare}
          onClick={onClose}
          style={{
            cursor: 'pointer',
          }}
        />
        <h2>{personaName}</h2>
        <p className="text-muted mb-1 ms-1">
          {pronunciation.breakdown} ( {pronunciation.ipa} )
        </p>
        {pronunciation.guide &&
          Object.entries(pronunciation.guide).map(([key, values]) => (
            <div key={key} className="mb-1 mt-1">
              <h5 className="guide-heading mb-1">{key}</h5>
              <ul>
                {values.map((value, index) => (
                  <li style={{ listStyleType: 'circle', marginLeft: '20px' }} key={index}>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </Modal>
  );
};
export default PronunciationModal;
