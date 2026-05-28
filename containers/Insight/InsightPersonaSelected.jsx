import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom';
import './InsightPersonaSelected.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import {
  fetchIceBreakers,
  fetchPersonaDo,
  fetchPersonaDont,
  fetchPersonaInteraction,
  fetchPersonality,
  fetchPersonaProfile,
  fetchPersonaSummary,
  fetchPronunciation,
  updatePersonaFeedback,
  updateSummary
} from '../../API/persona/PersonaAPI';
import PersonaAvatar from './PersonaAvatar';
import ModalComponent from './ModalComponent';
import PronunciationModal from './PronunciationModal';
import InsightTabs from './components/InsightTabs';
import {
  collegeGradeModalBackgroundStyle,
  countryModalBackgroundStyle,
  ethnicityModalBackgroundStyle,
  religionModalBackgroundStyle,
  totalExperienceModalBackgroundStyle,
  currentExperienceModalBackgroundStyle,
  locationTypeModalBackgroundStyle,
} from './PersonaSelectedCss';
import { fetchAdvice } from '../../API/advice/AdviceAPI';

const InsightPersonaSelected = ({ persona, setSelectedPersona, isLoggedInUser }) => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [dos, setDos] = useState(null);
  const [donts, setDonts] = useState(null);
  const [interactions, setInteractions] = useState(null);
  const [iceBreakers, setIceBreakers] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitError, setSubmitError] = useState("false");
  const [loading, setLoading] = useState(true);
  const [personality, setPersonality] = useState(null);
  const [showCountryModal, setCountryShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryAdvice, setCountryAdvice] = useState('');
  const [showTotalExperienceModal, setTotalExperienceShowModal] = useState(false);
  const [selectedTotalExperience, setSelectedTotalExperience] = useState('');
  const [currentExperienceAdvice, setCurrentExperienceAdvice] = useState('');
  const [showCurrentExperienceModal, setCurrentExperienceShowModal] = useState(false);
  const [selectedCurrentExperience, setSelectedCurrentExperience] = useState('');
  const [locationTypeAdvice, setLocationTypeAdvice] = useState('');
  const [showLocationTypeModal, setLocationTypeShowModal] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [totalExperienceAdvice, setTotalExperienceAdvice] = useState('');
  const [showEthnicityModal, setEthnicityShowModal] = useState(false);
  const [selectedEthnicity, setSelectedEthnicity] = useState('');
  const [ethnicityAdvice, setEthnicityAdvice] = useState('');
  const [showReligionModal, setReligionShowModal] = useState(false);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [religionAdvice, setReligionAdvice] = useState('');
  const [showCollegeGradeModal, setCollegeGradeShowModal] = useState(false);
  const [selectedCollegeGrade, setSelectedCollegeGrade] = useState('');
  const [collegeGradeAdvice, setCollegeGradeAdvice] = useState('');
  const [pronunciation, setPronunciation] = useState(null);
  const [showPronunciation, setShowPronunciation] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const profileData = await fetchPersonaProfile(persona.username);

        const results = await Promise.allSettled([
          fetchPersonaDo(persona.username),
          fetchPersonaDont(persona.username),
          fetchPersonaInteraction(profileData.relation),
          fetchIceBreakers(persona.username),
          fetchPersonality(persona.username),
          fetchPronunciation(persona.username),
        ]);
        setProfile(profileData);
        if (results[0].status === 'fulfilled') {
          setDos(results[0].value);
        } else {
          console.error('Failed to fetch "do" data:', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          setDonts(results[1].value);
        } else {
          console.error('Failed to fetch "don’t" data:', results[1].reason);
        }

        if (results[2].status === 'fulfilled') {
          setInteractions(results[2].value);
        } else {
          console.error('Failed to fetch interactions:', results[2].reason);
        }

        if (results[3].status === 'fulfilled') {
          setIceBreakers(results[3].value);
        } else {
          console.error('Failed to fetch icebreakers:', results[3].reason);
        }

        if (results[4].status === 'fulfilled') {
          setPersonality(results[4].value);
        } else {
          console.error('Failed to fetch personality data:', results[4].reason);
        }

        if (results[5].status === 'fulfilled') {
          setPronunciation(results[5].value);
        } else {
          console.error('Failed to fetch pronunciation data:', results[5].reason);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [persona.username]);

  const handleIceBreakerClick = (iceBreaker) => {
    if (iceBreaker.link) {
      window.open(iceBreaker.link, '_blank');
    } else {
      const encodedQuestion = encodeURIComponent(iceBreaker.text);
      window.open(`https://www.google.com/search?q=${encodedQuestion}`, '_blank');
    }
  };
  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        var response = await updatePersonaFeedback(persona.username, summary, feedback);
        console.log('handleFeedbackSubmit ...', response.data['Summary updated']);
        setSummary(response.data);
        setFeedback('');
        setSubmitError("false");
        console.log('[PsyGenie] [InsightPersonaSelected] [INFO] Feedback submitted successfully');
      } catch (error) {
        console.error('[PsyGenie] [InsightPersonaSelected] [ERROR] Error submitting feedback:', error);
        var errorMessage = error.response?.data?.message || "something went wrong! ";
        setSubmitError(errorMessage);
      }
    }
  };

  const handleSummaryUpdate= async (updatedSummary) => {
        try {
          var response = await updateSummary(persona.username, updatedSummary);
          console.log('handleFeedbackSubmit ...', response.data['Summary updated']);
          setSummary(updatedSummary);
          setFeedback('');
          setSubmitError("false");
          console.log('[PsyGenie] [InsightPersonaSelected] [INFO] Feedback submitted successfully');
        } catch (error) {
          console.error('[PsyGenie] [InsightPersonaSelected] [ERROR] Error submitting feedback:', error);
          var errorMessage = error.response?.data?.message || "something went wrong! ";
          setSubmitError(errorMessage);
        }
   };

  const handleCountryClick = async (country) => {
    setSelectedCountry(country);
    setCountryShowModal(true);
    try {
      const advice = await fetchAdvice('COUNTRY', country);
      setCountryAdvice(advice);
    } catch (error) {
      console.error('Error fetching country advice:', error);
      setCountryAdvice('No advice available for this country.');
    }
  };
  const closeCountryModal = () => {
    setCountryShowModal(false);
    setCountryAdvice('');
  };
   const handleCurrentExperienceClick = async (experience) => {
      setSelectedCurrentExperience(experience);
      setCurrentExperienceShowModal(true);
      try {
        const advice = await fetchAdvice('CURRENT_EXPERIENCE', experience);
        setCurrentExperienceAdvice(advice);
      } catch (error) {
        console.error('Error fetching current experience advice:', error);
        setCurrentExperienceAdvice('No advice available for this current experience.');
      }
    };
    const closeCurrentExperienceModal = () => {
      setCurrentExperienceShowModal(false);
      setCurrentExperienceAdvice('');
    };

    const handleLocationTypeClick = async (locType) => {
          setSelectedLocationType(locType);
          setLocationTypeShowModal(true);
          try {
            const advice = await fetchAdvice('CITYTIER', locType);
            setLocationTypeAdvice(advice);
          } catch (error) {
            console.error('Error fetching location type advice:', error);
            setLocationTypeAdvice('No advice available for this location type.');
          }
        };
        const closeLocationTypeModal = () => {
          setLocationTypeShowModal(false);
          setLocationTypeAdvice('');
        };
  const handleTotalExperienceClick = async (experience) => {
    setSelectedTotalExperience(experience);
    setTotalExperienceShowModal(true);
    try {
      const advice = await fetchAdvice('TOTAL_EXPERIENCE', experience);
      setTotalExperienceAdvice(advice);
    } catch (error) {
      console.error('Error fetching total experience advice:', error);
      setTotalExperienceAdvice('No advice available for this total experience.');
    }
  };
  const closeTotalExperienceModal = () => {
    setTotalExperienceShowModal(false);
    setTotalExperienceAdvice('');
  };
  const handleEthnicityClick = async (ethnicity) => {
    setSelectedEthnicity(ethnicity);
    setEthnicityShowModal(true);
    try {
      const advice = await fetchAdvice('ETHNICITY', ethnicity);
      setEthnicityAdvice(advice);
    } catch (error) {
      console.error('Error fetching ethnicity advice:', error);
      setEthnicityAdvice('No advice available for this ethnicity.');
    }
  };
  const closeEthnicityModal = () => {
    setEthnicityShowModal(false);
    setEthnicityAdvice('');
  };
  const handleReligionClick = async (religion) => {
    setSelectedReligion(religion);
    setReligionShowModal(true);
    try {
      const advice = await fetchAdvice('RELIGION', religion);
      setReligionAdvice(advice);
    } catch (error) {
      console.error('Error fetching religion advice:', error);
      setReligionAdvice('No advice available for this religion.');
    }
  };
  const closeReligionModal = () => {
    setReligionShowModal(false);
    setReligionAdvice('');
  };
  const handleCollegeGradeClick = async (collegeGrade) => {
    setSelectedCollegeGrade(collegeGrade);
    setCollegeGradeShowModal(true);
    try {
      const advice = await fetchAdvice('GRADE', collegeGrade);
      setCollegeGradeAdvice(advice);
    } catch (error) {
      console.error('Error fetching college grade advice:', error);
      setCollegeGradeAdvice('No advice available for this college grade.');
    }
  };
  const closeCollegeGradeModal = () => {
    setCollegeGradeShowModal(false);
    setCollegeGradeAdvice('');
  };

  useEffect(() => {
    const mainContainer = document.querySelector('#MainContainer');
    console.log('render sticky in main container');
    if (mainContainer) {
      const existingStickyElement = mainContainer.querySelector('.stickContent');
      if (existingStickyElement) {
        existingStickyElement.remove();
      }
      const stickyElement = document.createElement('div');
      stickyElement.className = 'stickContent';
      mainContainer.prepend(stickyElement);

      const root = createRoot(stickyElement);
      root.render(
        <div>
          {!isLoggedInUser && (
            <div className="back-button" onClick={removeSticky}>
              <i className="fa fa-xmark-circle" />
            </div>
          )}
          <PersonaAvatar
            persona={persona}
            pronunciation={pronunciation}
            setShowPronunciation={setShowPronunciation}
            personality={personality}
          />
        </div>
      );
    }
  }, [personality]);

  function removeSticky() {
    const mainContainer = document.querySelector('#MainContainer');
    if (mainContainer) {
      const existingStickyElement = mainContainer.querySelector('.stickContent');
      if (existingStickyElement) {
        existingStickyElement.remove();
      }
    }
    setSelectedPersona(null);
  }

  function handleTabClick() {
    // Select all elements with the class "custom-scrollbar"
    const elements = document.getElementsByClassName("tab-content");

    // Loop through the elements and set scroll position
    for (let element of elements) {
      element.scrollTop = 0;
    }
  }

  return (
    <div className="selected-persona">
      <div className="profile-section">
        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon" />
          </div>
        ) : (
          <InsightTabs
            profile={profile}
            personality={personality}
            dos={dos}
            donts={donts}
            interactions={interactions}
            iceBreakers={iceBreakers}
            summary={summary}
            feedback={feedback}
            setFeedback={setFeedback}
            handleFeedbackSubmit={handleFeedbackSubmit}
            handleSummaryUpdate={handleSummaryUpdate}
            setSummary={setSummary}
            submitError={submitError}
            persona={persona}
            handleCountryClick={handleCountryClick}
            handleTotalExperienceClick={handleTotalExperienceClick}
            handleCurrentExperienceClick={handleCurrentExperienceClick}
            handleLocationTypeClick={handleLocationTypeClick}
            handleEthnicityClick={handleEthnicityClick}
            handleReligionClick={handleReligionClick}
            handleCollegeGradeClick={handleCollegeGradeClick}
            isLoggedInUser = {isLoggedInUser}
            handleTabClick = {handleTabClick}
          />
        )}
      </div>

      <ModalComponent
        isOpen={showCountryModal}
        onRequestClose={closeCountryModal}
        title={selectedCountry}
        content={countryAdvice}
        backgroundStyle={countryModalBackgroundStyle}
      />

      <ModalComponent
        isOpen={showTotalExperienceModal}
        onRequestClose={closeTotalExperienceModal}
        title={`${selectedTotalExperience}`}
        content={totalExperienceAdvice}
        backgroundStyle={totalExperienceModalBackgroundStyle}
      />

      <ModalComponent
              isOpen={showCurrentExperienceModal}
              onRequestClose={closeCurrentExperienceModal}
              title={`${selectedCurrentExperience}`}
              content={currentExperienceAdvice}
              backgroundStyle={currentExperienceModalBackgroundStyle}
      />

      <ModalComponent
                    isOpen={showLocationTypeModal}
                    onRequestClose={closeLocationTypeModal}
                    title={`${selectedLocationType}`}
                    content={locationTypeAdvice}
                    backgroundStyle={locationTypeModalBackgroundStyle}
      />

      <ModalComponent
        isOpen={showEthnicityModal}
        onRequestClose={closeEthnicityModal}
        title={selectedEthnicity}
        content={ethnicityAdvice}
        backgroundStyle={ethnicityModalBackgroundStyle}
      />

      <ModalComponent
        isOpen={showReligionModal}
        onRequestClose={closeReligionModal}
        title={selectedReligion}
        content={religionAdvice}
        backgroundStyle={religionModalBackgroundStyle}
      />

      <ModalComponent
        isOpen={showCollegeGradeModal}
        onRequestClose={closeCollegeGradeModal}
        title={selectedCollegeGrade}
        content={collegeGradeAdvice}
        backgroundStyle={collegeGradeModalBackgroundStyle}
      />

      <PronunciationModal
        isOpen={showPronunciation}
        onClose={() => setShowPronunciation(false)}
        pronunciation={pronunciation}
        personaName={persona.fullName}
      />
    </div>
  );
};
export default InsightPersonaSelected;
