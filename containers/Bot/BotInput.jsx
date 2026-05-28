import React, { useState } from 'react';

const actionOptions = [
  { text: 'Resolve Conflict', value: 'resolve_conflict' },
  { text: 'Deny Request', value: 'deny_request' },
  { text: 'Give Feedback', value: 'give_feedback' },
  { text: 'Persuade and Influence', value: 'persuade_influence' },
  { text: 'Support Emotionally', value: 'emotional_support' },
  { text: 'Motivate and Engage', value: 'motivation_engagement' },
  { text: 'Negotiate or Compromise', value: 'negotiation_compromise' },
  { text: 'Leadership and Team Dynamics', value: 'leadership_team_dynamics' },
  { text: 'Manage Stress and Anxiety', value: 'stress_anxiety' },
  { text: 'Problem Solving or Decision Making', value: 'problem_solving' }
];

const BotInput = ({ handleSubmit, loading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState('resolve_conflict');

  return (
    <div>
      <div className="fs-14 fw-semibold text-orange mt-2">Additional Info</div>
      <textarea
        className="bot-input form-control mb-2"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Provide any additional information or specific objectives you want PsyGenie to assist with."
        rows={4}
        disabled={loading}
      />

      <div className="fs-14 fw-semibold text-orange">Select an Action</div>
      <select
        className="bot-dropdown form-control form-select"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        disabled={loading}
      >
        {actionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>

      <div className="text-end">
        <button className="bot-submit btn btn-warning btn-orange mt-3" onClick={() => handleSubmit(inputText, selectedOption)} disabled={loading}>
          {loading ? 'Processing...' : 'Assist'}
        </button>
      </div>
    </div>
  );
};

export default BotInput;