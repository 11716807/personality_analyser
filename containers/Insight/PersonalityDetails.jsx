import React from 'react';

const PersonalityDetails = ({ personality }) => {
  return (
    <div className="personality-details">
      <h3 className="small-personality-title mb-0">{personality.name}</h3>
      <p className="fs6 mb-0 fw-light font-monospace personality-personality">{personality.personality}</p>
      <span role="img" aria-label="emoji">
        {personality.emoji}
      </span>
      <p className="fs6 mt-3 text-center">{personality.description}</p>
    </div>
  );
};
export default PersonalityDetails;
