import React from 'react';
import './PanelContainer.css';

const PanelContainer = ({ children }) => {
  return (
    <div className="panel-container custom-scrollbar" id="MainContainer">
      {children}
    </div>
  );
};

export default PanelContainer;
