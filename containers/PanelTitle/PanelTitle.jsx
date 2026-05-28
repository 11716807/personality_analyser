import React from 'react';
import './PanelTitle.css';

const PanelTitle = ({ title }) => {
  return (
    <div className="panel-title-container">
      <h1 className="panel-title">{title}</h1>
      <div className="panel-title-separator"></div>
    </div>
  );
};

export default PanelTitle;
