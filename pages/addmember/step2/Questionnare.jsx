import React, { useState, useEffect } from 'react';
import JSConfetti from 'js-confetti';
import { axiosInstance } from '../../../API/CustomAxiosConfig'; // Ensure this is the correct axios instance
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// Move these utility functions to the top
const levels = ['Completely Disagree', 'Disagree', 'Neutral', 'Agree', 'Completely Agree'];

const convertToSliderValue = (score) => {
  switch (score) {
    case -2:
      return 10;
    case -1:
      return 30;
    case 0:
      return 50;
    case 1:
      return 70;
    case 2:
      return 90;
    default:
      return 50; // Default if no score provided
  }
};

const convertToScore = (value) => {
  if (value <= 20) return -2; // Completely Disagree
  else if (value <= 40) return -1; // Disagree
  else if (value <= 60) return 0; // Neutral
  else if (value <= 80) return 1; // Agree
  else return 2; // Completely Agree
};

const traits = [
  { name: 'O', question: 'He enjoys trying new experiences' }, // Openness
  { name: 'C', question: 'He is reliable and organized' }, // Conscientiousness
  { name: 'E', question: 'He enjoys attending social gatherings and parties' }, // Extraversion
  { name: 'A', question: 'He is empathetic and considerate of others' }, // Agreeableness
  { name: 'N', question: 'He remains calm under pressure' }, // Emotional Stability (Neuroticism)
];

function Questionnaire({ profileData, handleNext, handlePrevious, onScreenChange, isMyProfile }) {
  const [values, setValues] = useState(
    traits.map((trait) => {
      // Use profileData scores if available, otherwise default to 50
      const score = profileData ? profileData[`${trait.name.toLowerCase()}Score`] : 50;
      return convertToSliderValue(score);
    })
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to show success message
  const jsConfetti = new JSConfetti(); // Initialize js-confetti instance

  useEffect(() => {
    if (profileData) {
      setValues(
        traits.map((trait) => {
          const score = profileData[`${trait.name.toLowerCase()}Score`];
          return convertToSliderValue(score);
        })
      );
    }
  }, [profileData]);

  const handleSliderChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = parseInt(event.target.value);
    setValues(newValues);
  };

  const getLevelLabel = (value) => {
    if (value <= 20) return levels[0];
    else if (value <= 40) return levels[1];
    else if (value <= 60) return levels[2];
    else if (value <= 80) return levels[3];
    else return levels[4];
  };

  const handleSubmit = async () => {
    // Map slider values to scores
    const scores = {
      personaUserName: profileData.personaUserName,
      o: convertToScore(values[0]), // Openness
      c: convertToScore(values[1]), // Conscientiousness
      e: convertToScore(values[2]), // Extraversion
      a: convertToScore(values[3]), // Agreeableness
      n: convertToScore(values[4]), // Neuroticism (Emotional Stability)
    };

    try {
      const response = await axiosInstance.post('/chrome/update-ocean', scores);
      console.log('Response:', response.data);

      // Trigger confetti and show success message on successful submit
      jsConfetti.addConfetti();
      setShowSuccessMessage(true);
      console.log('isMyProfile ' + isMyProfile);
      if (isMyProfile == true) {
        onScreenChange('my_profile');
        handleMenuClick(event, 'My Personality');
      } else {
        onScreenChange('insight');
        handleMenuClick(event, 'Insights');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleMenuClick = (event, message) => {
    console.log(message);
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
  };

  return (
    <div className="">
      <div className="mb-3">
        Help us learn more about them! This personality assessment will reveal key insights into their strengths,
        preferences, and potential. Answer thoughtfully to ensure accurate and meaningful results.
      </div>
      {traits.map((trait, index) => (
        <div key={trait.name} className="align-items-center mb-2 question-block">
          <div className="trait-question">{trait.question}</div>
          <div className="trait-range">
            <div className="text-danger">
              <FaThumbsDown /> {/* Thumbs Down Icon */}
            </div>
            <div className="trait-range-bar">
              <Form.Range
                min="0"
                max="100"
                value={values[index]}
                onChange={(event) => handleSliderChange(index, event)}
              />
            </div>
            <div className="text-success">
              <FaThumbsUp /> {/* Thumbs Up Icon */}
            </div>
          </div>
          <div className="text-center text-muted fw-bold">{getLevelLabel(values[index])}</div>
        </div>
      ))}
      <div className="text-center mt-4 mb-2">
        <button className="btn btn-sm btn-outline-dark float-start" onClick={handlePrevious}>
          <i className="fa-solid fa-angles-left"></i> Prev
        </button>
        <Button variant="outline-dark" className="float-end btn-sm" onClick={handleSubmit}>
          Finish <i className="fa-solid fa-angles-right"></i>
        </Button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{ marginTop: '20px', color: '#4caf50', fontWeight: 'bold', textAlign: 'center' }}>
          🎉 Profile Created Successfully!
        </div>
      )}
    </div>
  );
}

export default Questionnaire;
