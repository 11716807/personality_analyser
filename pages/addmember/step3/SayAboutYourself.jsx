import React, { useState } from 'react';
import JSConfetti from 'js-confetti';
import { Button, Form } from 'react-bootstrap';
import { axiosInstance } from '../../../API/CustomAxiosConfig';

const TextAreaWithSubmit = ({ personaUserName, handleNext, onScreenChange, handlePrevious, isMyProfile }) => {
  const [text, setText] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // To show success message
  const jsConfetti = new JSConfetti(); // Initialize JSConfetti instance

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // First API call
      const requestData = {
        manualFeedback: text,
        userSummary: '',
        personaUserName,
      };

      const firstResponse = await axiosInstance.post('/chrome/update-manual-summary', requestData);
      console.log('First API Response:', firstResponse.data);

      // Extracting data from the response
      const phraseMatch = firstResponse.data.match(/Extracted Phrase:\s*"([^"]*)"/);
      const extractedPhrase = phraseMatch ? phraseMatch[1] : '';

      const summaryMatch = firstResponse.data.match(/Updated Summary:\s*\[([^\]]*)\]/);
      const updatedSummary = summaryMatch ? JSON.parse(`[${summaryMatch[1]}]`) : [];

      // Second API call
      const secondData = {
        extractedPhrase,
        updatedSummary,
        personaUserName,
      };

      const secondResponse = await axiosInstance.post('/chrome/save-manual-summary', secondData);
      console.log('Second API Response:', secondResponse.data);

      // Reset state and show success message
      setText('');
      jsConfetti.addConfetti();
      setShowSuccessMessage(true); // Show success message
      handleMenuClick(event, 'Insights');
      onScreenChange('insight');
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  const handleMenuClick = (event, message) => {
    console.log(message);
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
  };

  return (
    <div>
      {/* Text Area for Feedback */}
      <Form.Control
        as="textarea"
        rows={4}
        value={text}
        onChange={handleChange}
        placeholder="Write something..."
        style={{ resize: 'none', marginBottom: '10px' }}
      />
      <button className="btn btn-secondary" onClick={handlePrevious}>
        Previous
      </button>
      <Button variant="primary" onClick={handleSubmit} className="mb-3">
        Finish
      </Button>

      {/* Success Message */}
      {showSuccessMessage && (
        <div style={{ marginTop: '20px', color: '#4caf50', fontWeight: 'bold', textAlign: 'center' }}>
          🎉 Step Completed Successfully!
        </div>
      )}
    </div>
  );
};

export default TextAreaWithSubmit;
