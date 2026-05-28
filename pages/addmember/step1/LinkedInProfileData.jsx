import React from 'react';
import { axiosInstance } from '../../../API/CustomAxiosConfig'; // Ensure this is the correct axios instance
import LinkedInLLMData from './LinkedInLLMData';

const ProfileData = ({ profileData, isLoggedInUser, handleNext, handlePrevious, onScreenChange, isLastPage }) => {
  const submitLLMData = async (updatedData) => {
    try {
      await axiosInstance.post('/chrome/save-llm-profile', {
        llmProfileBean: updatedData,
        peronaUserName: profileData.name,
        isLoggedInUser,
        linkedInUserName: profileData.linkedInUserName,
        imageUrl: profileData.imageUrl,
      });

      await axiosInstance
        .post('/chrome/persona/pronunciation/generate', { username: profileData.personaUserName })
        .catch((error) => console.error('Error generating pronunciation:', error));

      await axiosInstance
        .post('/chrome/persona/icebreaker/generate', { username: profileData.personaUserName })
        .catch((error) => console.error('Error generating icebreakers:', error));

      if (isLastPage) {
        if (isLoggedInUser) {
          console("render my_profile from profile data");
          onScreenChange('my_profile');
          handleMenuClick('My Personality');
        } else {
          onScreenChange('insight');
          handleMenuClick('Insight');
        }
      } else {
        handleNext();
      }

      console.log('LLM data submitted successfully.');
    } catch (error) {
      console.error('Error submitting LLM data:', error);
    }
  };

  const handleMenuClick = (message) => {
    console.log(message);
    // Update the active menu tab UI
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
  };

  return (
    <div className="">
      {profileData ? (
        <LinkedInLLMData
          data={profileData}
          onSubmit={submitLLMData}
          handlePrevious={handlePrevious}
          isLastPage={isLastPage}
        />
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default ProfileData;
