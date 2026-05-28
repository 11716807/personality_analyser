import React, { useState } from 'react';
import './Insight.css';
import InsightPersonaList from './InsightPersonaList';
import InsightPersonaSelected from './InsightPersonaSelected';
import PanelContainer from '../PanelContainer/PanelContainer';

const Insight = ({ onScreenChange , status }) => {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };
  return (
    <PanelContainer>
      <div className="insight-content-wrapper">
        <div className={`slide-container ${selectedPersona ? 'show-selected' : ''}`}>
          <div className={`slide-page ${selectedPersona ? 'hidden' : ''}`}>
            <InsightPersonaList onPersonaSelect={handlePersonaSelect} onScreenChange={onScreenChange} status = {status}/>
          </div>
          <div className={`slide-page ${selectedPersona ? '' : 'hidden'}`}>
            {selectedPersona && (
              <InsightPersonaSelected persona={selectedPersona} setSelectedPersona = {setSelectedPersona}/>
            )}
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
export default Insight;
