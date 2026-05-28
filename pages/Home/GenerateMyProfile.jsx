import React, { useState, useEffect } from 'react';
import createProfileImg from '../../assets/img/create_profile';
import { axiosInstance } from '../../API/CustomAxiosConfig';
import ExpandableSteps from '../addmember/ExpandableSteps';
import InsightPersonaSelected from '../../containers/Insight/InsightPersonaSelected';
import { useAuth } from '../Auth/AuthContext';
import NotificationBar from "../../pages/addmember/NotificationBar";
import {APP_URL} from "../../API/Config/AppConfig";

const GenerateMyProfile = ({ onScreenChange , setStatus, setLoggedInUserPersona}) => {
  const [showExpandableSteps, setShowExpandableSteps] = useState(false);
  const [personalityData, setPersonalityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { setIsPersonalProfileGenerated } = useAuth();
  const UserGuideURL = APP_URL + "/user-guide"

  useEffect(() => {
    const fetchPersonalityData = async () => {
      try {
        const response = await axiosInstance.get('/chrome/fetchPersonaForLoggedInUser');
        console.log('Personality Data Response:', response.data); // Debug log

        if (response.data && Object.keys(response.data).length > 0) {
          setPersonalityData({
            username: response.data.personaUserName,
            fullName: response.data.displayName,
            pronounce: response.data.pronounce,
          });
          setStatus([response.data.status, response.data.plan]);
          setIsPersonalProfileGenerated(true);
          setShowExpandableSteps(false); // Hide expandable steps if data is valid
          setLoggedInUserPersona({username: response.data.personaUserName,
                                    fullName: response.data.displayName,
                                     pronounce: response.data.pronounce,
                                      });
        } else {
          setPersonalityData(null);
        }
        setError(false);
      } catch (error) {
        console.error('Error fetching personality data:', error);
        setError(true);
        setPersonalityData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalityData();
  }, []);

  const handleCreateProfile = () => {
    setShowExpandableSteps(true);
  };

  return (
    <>
      {loading ? (
        <div></div>
      ) : error ? (
        <section className="custom-scrollbar" id="MainContainer">
          <div className="mt-3 p-2 text-center">
            <div className="fw-bold fs-2 text-danger">Something went wrong!</div>
            <div className="mt-2 fs-6 text-darkslategray">
              We encountered an issue on our side. Please try again later.
            </div>
          </div>
        </section>
      ) : personalityData ? (
        <div className="custom-scrollbar" id="MainContainer">
          <InsightPersonaSelected
            persona={personalityData}
            onBack={() => setShowExpandableSteps(false)}
            isLoggedInUser={true}
          />
        </div>
      ) : (
        <>
          {!showExpandableSteps ? (
            <section className="custom-scrollbar" id="MainContainer">
              <div className="demo-notification-bar">
                <NotificationBar
                  message="How to create your own profile? Click here to watch and learn!"
                  link={UserGuideURL}
                />
              </div>
              <div className="mt-3 p-2 text-center">
                <div className="fw-bold fs-2">Welcome to PsyGenie!</div>
                <div className="mt-2 fs-6 text-darkslategray">
                  Your journey to building stronger connections starts here!
                </div>
                <img src={createProfileImg} width={200} alt="Create Profile"/>
                <div className="fs-5 fw-bold mt-2">Ready to spread your wings?</div>
                <div className="fs-6">
                  Let’s create your profile to unlock tailored personality insights, meaningful suggestions, and tools
                  to enhance your interactions with others.
                </div>
                <button className="btn btn-gray mt-3" onClick={handleCreateProfile}>
                  Create My Profile Now
                </button>
              </div>
            </section>
            ) : (
            <ExpandableSteps
              isLoggedInUser={true}
              onScreenChange={onScreenChange}
              isMyProfile={true}
            />
          )}
        </>
      )}
    </>
  );
};

export default GenerateMyProfile;
