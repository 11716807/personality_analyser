import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ProfileTab from './ProfileTab';
import BehaviorTab from './BehaviorTab';
import NotesTab from './NotesTab';
import IcebreakerTab from './IcebreakerTab';

const InsightTabs = ({
  profile,
  personality,
  dos,
  donts,
  interactions,
  iceBreakers,
  summary,
  feedback,
  setFeedback,
  handleFeedbackSubmit,
  handleSummaryUpdate,
  setSummary,
  submitError,
  persona,
  handleCountryClick,
  handleTotalExperienceClick,
  handleCurrentExperienceClick,
  handleLocationTypeClick,
  handleEthnicityClick,
  handleReligionClick,
  handleCollegeGradeClick,
  isLoggedInUser,
  handleTabClick
}) => {
  return (
    <Tabs defaultActiveKey="profile" onSelect={handleTabClick} id="insight-tabs">
      <Tab eventKey="profile" title={<><span className="active-title"><i className="fa-solid fa-user"></i> Profile</span><span
          className="inactive-title fs-14"><i className="fa-solid fa-user"></i></span></>}>
      <ProfileTab
          profile={profile}
          handleCountryClick={handleCountryClick}
          handleTotalExperienceClick={handleTotalExperienceClick}
          handleCurrentExperienceClick={handleCurrentExperienceClick}
          handleLocationTypeClick={handleLocationTypeClick}
          handleEthnicityClick={handleEthnicityClick}
          handleReligionClick={handleReligionClick}
          handleCollegeGradeClick={handleCollegeGradeClick}
        />
      </Tab>
        <Tab eventKey="other" title={<><span className="active-title"><i className="fa-solid fa-masks-theater"></i> Behaviour</span><span
            className="inactive-title fs-14"><i className="fa-solid fa-masks-theater"></i></span></>}>
        <BehaviorTab
          profile={profile}
          personality={personality}
          dos={dos}
          donts={donts}
          interactions={interactions}
          iceBreakers={iceBreakers}
        />
      </Tab>

       <Tab eventKey="Icebreaker" title={<><span className="active-title"><i className="fa-solid fa-snowflake"></i> Icebreaker</span><span
                    className="inactive-title fs-14"><i className="fa-solid fa-snowflake"></i></span></>}>
              <IcebreakerTab persona={persona} isLoggedInUser = {isLoggedInUser}/>
            </Tab>

        <Tab eventKey="Notes" title={<><span className="active-title"><i className="fa-solid fa-clipboard"></i> Channel Summary</span><span
              className="inactive-title fs-14"><i className="fa-solid fa-clipboard"></i></span></>}>
        <NotesTab
            summary={summary}
          feedback={feedback}
          setFeedback={setFeedback}
          handleFeedbackSubmit={handleFeedbackSubmit}
          handleSummaryUpdate={handleSummaryUpdate}
          setSummary={setSummary}
          submitError={submitError}
          persona={persona}
          isLoggedInUser = {isLoggedInUser}
        />
      </Tab>

    </Tabs>
  );
};

export default InsightTabs;
