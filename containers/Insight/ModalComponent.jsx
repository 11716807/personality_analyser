import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleNotch, faXmarkSquare} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import ReactMarkdown from 'react-markdown';
import { customModalStyles } from './PersonaSelectedCss';

const ModalComponent = ({ isOpen, onRequestClose, title, content, backgroundStyle }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="custom-scrollbar" contentLabel={title} style={customModalStyles} >
      <div style={backgroundStyle} />
      <div className="back-section">
        <FontAwesomeIcon
          className="back-button"
          icon={faXmarkSquare}
          onClick={onRequestClose}
          style={{ cursor: 'pointer'}}
        />
        <h2>{title}</h2>
      </div>
      <p className="fs-6 justify-content-end">
         {content ? (<ReactMarkdown>{content}</ReactMarkdown>) :
           (
             <div className="loading-spinner">
               <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon" />
             </div>
           )
         }
      </p>
    </Modal>
  );
};
export default ModalComponent;
