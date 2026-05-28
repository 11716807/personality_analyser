import React, { useState } from 'react';
import FileUploader from './step1/FileUploader';
import KnowMore from './step1/KnowMore';
import ProfileData from './step1/LinkedInProfileData';
import { axiosInstance } from '../../API/CustomAxiosConfig';
import PanelLabel from '../../containers/PanelLabel/PanelLabel';
import NotificationBar from './NotificationBar';


const ExpandableSteps = ({ isLoggedInUser, onScreenChange, isMyProfile }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [knowledge, setKnowledge] = useState('');
  const [relation, setRelation] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleFileSubmit = (payload) => {
    // Handle the specific case where the user has "Never met him/her"

    if (payload.knowledge === '2') {
      setKnowledge(payload.knowledge);
      setRelation(payload.relationship);
      handleApiSubmission({
        knowledge: payload.knowledge,
        relation: payload.relationship,
      });
    }
    // Handle other cases where knowledge is not empty and not "Never met him/her"
    else {
      setKnowledge(payload.knowledge);
      setRelation(payload.relationship);
      setCurrentStep(2); // Move to the next step
    }
  };

  const handleApiSubmission = async (additionalData = {}) => {
    setUploadMessage("");
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('isLoggedInUser', isLoggedInUser);
    formData.append('knowledge', additionalData.knowledge || knowledge);
    formData.append('relation', additionalData.relation || relation);
    formData.append('knowMoreResponses', JSON.stringify(additionalData));

    try {
      setIsSubmitting(true);
      setLoading(true);
      const response = await axiosInstance.post('/chrome/submit-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.llmProfileBean && response.data.message.includes("success")) {
        setProfileData(response.data.llmProfileBean);
        setUploadMessage('File uploaded successfully!');
        console.log('Knowledge:', knowledge);
        setLoading(false);
        setCurrentStep(additionalData.knowledge === '2' ? 2 : 3);
      } else if(response.data.message){
        setUploadMessage(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadMessage('Failed to upload the file. Please try again.');
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles the previous button click
  const handlePrevious = () => {
    setUploadMessage('');
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  function resetScrollPosition() {
    // Select all elements with the class "custom-scrollbar"
    const elements = document.getElementsByClassName("custom-scrollbar");

    // Loop through the elements and set scroll position
    for (let element of elements) {
      element.scrollTop = 0;
    }
  }

  // Handles the next button click
  const handleNext = () => {
    setUploadMessage('');
    if (currentStep === 1 && selectedFile) {
      setCurrentStep(2);
      resetScrollPosition();
    } else if (currentStep === 2 && knowledge !== '2') {
      setCurrentStep(3);
      resetScrollPosition();
    }
  };

  return (
    <div className="custom-scrollbar" id="MainContainer">
      <div className="p-2">
        <div className="page-header">
          <div className="page-header-text">
              {isMyProfile ?
                  (   <>
{/*                       <NotificationBar */}
{/*                         message="How to create own profile ? Here is your way." */}
{/*                         link="https://www.google.com" */}
{/*                       /> */}
                      <PanelLabel text="Discover Yourself with PsyGenie" />
                      </>):
                  (<>
{/*                       <NotificationBar */}
{/*                      message="How to create persona profile ? Here is your way." */}
{/*                      link="https://www.google.com" */}
{/*                    /> */}
                      <PanelLabel text="Build stronger connections with Psygenie" />
                      </>)}
          </div>
        </div>

        {currentStep === 1 && (
          <FileUploader
            onFileSelect={handleFileSelect}
            onFileSubmit={handleFileSubmit}
            uploadMessage={uploadMessage}
            isSubmitting={isSubmitting}
            isLoggedInUser={isLoggedInUser}
            loading={loading}
          />
        )}

        {currentStep === 2 && knowledge === '2' && (
          <ProfileData
            profileData={profileData}
            isLoggedInUser={isLoggedInUser}
            handleNext={handleNext}
            onScreenChange={onScreenChange}
            isLastPage={true}
          />
        )}

        {currentStep === 2 && knowledge !== '2' && (
          <KnowMore
            knowledge={knowledge}
            handleNext={handleApiSubmission}
            handlePrevious={handlePrevious}
            uploadMessage={uploadMessage}
            setUploadMessage={setUploadMessage}
          />
        )}

        {currentStep === 3 && knowledge !== '2' && (
          <ProfileData profileData={profileData} isLoggedInUser={isLoggedInUser} handleNext={handleNext} onScreenChange={onScreenChange} isLastPage={true}/>
        )}
      </div>
    </div>
  );
};

export default ExpandableSteps;
