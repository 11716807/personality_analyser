import React from 'react';
import AccordionItem from '../AccordionItem';

const ProfileTab = ({
  profile,
  handleCountryClick,
  handleTotalExperienceClick,
  handleCurrentExperienceClick,
  handleLocationTypeClick,
  handleEthnicityClick,
  handleReligionClick,
  handleCollegeGradeClick,
}) => {
  if (!profile) return null;

   const parentId = "profileAccordion"; // Define the parent ID


  return (
    <>
      <div className="accordion" id="ProfileSummaryAccordion">
        {/* Profile Summary Panel */}
        <AccordionItem
          id="ProfileSummary"
          parentId="ProfileSummaryAccordion"
          title={
            <>
            <span className="fw-bold fs-14">
              <i className="fa-solid fa-user"></i>&nbsp;Profile Summary
            </span>
            </>
          }
          content={
            <div className="profile-summary fs-14">
              <p>{profile.profileSummary}</p>
            </div>
          }
          isVisible={true}
        />
      </div>
        {/* Personal Information Panel */}
        <div className="accordion" id="PersonalInfoAccordion">
          <AccordionItem
            id="PersonalInfo"
            parentId="PersonalInfoAccordion"
            title={
              <>
            <span className="fw-bold fs-14">
              <i className="fa-solid fa-id-card"></i>&nbsp;Personal Information
            </span>
              </>
            }
            content={
              <div className="personal-info">
                <div className="profile-row">
                  <span className="label">First Name:</span>
                  <span className="value">{profile.firstName}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Last Name:</span>
                  <span className="value">{profile.lastName}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Display Name:</span>
                  <span className="value">{profile.displayName}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Gender:</span>
                  <span className="value">{profile.gender}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Age:</span>
                  <span className="value">{profile.age}</span>
                </div>
              </div>
            }
            isVisible={true}
          />
        </div>
        {/* Professional Information Panel */}
        <div className="accordion" id="ProfessionalInfoAccordion">
          <AccordionItem
            id="ProfessionalInfo"
            parentId="ProfessionalInfoAccordion"
            title={
              <>
            <span className="fw-bold fs-14">
              <i className="fa-solid fa-briefcase"></i>&nbsp;Professional Information
            </span>
              </>
            }
            content={
              <div className="professional-info">
                <div className="profile-row">
                  <span className="label">Current Org Experience:</span>
                  <span className="value">{profile.expCurrOrg} years</span>
                </div>
                <div className="profile-row"
                     onClick={() => handleCurrentExperienceClick(profile.expCurrOrgBucket)}
                     style={{cursor: 'pointer'}}>
                  <span className="label">Current Org Experience Level:</span>
                  <span className="value">{profile.expCurrOrgBucket} <i
                    className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
                <div className="profile-row">
                  <span className="label">Total Experience:</span>
                  <span className="value">{profile.expTotal} years</span>
                </div>
                <div className="profile-row"
                     onClick={() => handleTotalExperienceClick(profile.expBucket)}
                     style={{cursor: 'pointer'}}>
                  <span className="label">Total Experience Level:</span>
                  <span className="value">{profile.expBucket} <i className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
                <div className="profile-row">
                  <span className="label">College:</span>
                  <span className="value">{profile.college}</span>
                </div>
                <div
                  className="profile-row"
                  onClick={() => handleCollegeGradeClick(profile.collegeGrade)}
                  style={{cursor: 'pointer'}}
                >
                  <span className="label">College Grade:</span>
                  <span className="value">{profile.collegeGrade} <i
                    className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
              </div>
            }
            isVisible={true}
          />
        </div>
        {/* Location Information Panel */}
        <div className="accordion" id="LocationInfoAccordion">
          <AccordionItem
            id="LocationInfo"
            parentId="LocationInfoAccordion"
            title={
              <>
            <span className="fw-bold fs-14">
              <i className="fa-solid fa-map-marker-alt"></i>&nbsp;Location Information
            </span>
              </>
            }
            content={
              <div className="location-info">
                <div className="profile-row">
                  <span className="label">Current Location:</span>
                  <span className="value">{profile.currLocation} </span>
                </div>
                <div className="profile-row"
                     onClick={() => handleLocationTypeClick(profile.currentCityTier)}
                     style={{cursor: 'pointer'}}>
                  <span className="label">Location Type:</span>
                  <span className="value">{profile.currentCityTier} <i
                    className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
                <div className="profile-row">
                  <span className="label">Previous Location(s):</span>
                  <span className="value">{profile.prevLocation}</span>
                </div>
              </div>
            }
            isVisible={true}
          />
        </div>
        {/* Cultural Information Panel */}
        <div className="accordion" id="CulturalInfoAccordion">
          <AccordionItem
            id="CulturalInfo"
            parentId="CulturalInfoAccordion"
            title={
              <>
            <span className="fw-bold fs-14">
              <i className="fa-solid fa-globe"></i>&nbsp;Cultural Information
            </span>
              </>
            }
            content={
              <div className="cultural-info">
                <div
                  className="profile-row"
                  onClick={() => handleEthnicityClick(profile.ethnicity)}
                  style={{cursor: 'pointer'}}
                >
                  <span className="label">Ethnicity:</span>
                  <span className="value">{profile.ethnicity} <i className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
                <div
                  className="profile-row"
                  onClick={() => handleCountryClick(profile.countryOfOrigin)}
                  style={{cursor: 'pointer'}}
                >
                  <span className="label">Country of Origin:</span>
                  <span className="value">{profile.countryOfOrigin} <i
                    className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
                <div
                  className="profile-row"
                  onClick={() => handleReligionClick(profile.religion)}
                  style={{cursor: 'pointer'}}
                >
                  <span className="label">Religion:</span>
                  <span className="value">{profile.religion} <i className="fa-solid fa-arrow-up-right-from-square"></i></span>
                </div>
              </div>
            }
            isVisible={true}
          />
        </div>
      </>
      );
      };

      export default ProfileTab;