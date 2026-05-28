import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ETHNICITIES, RELIGIONS, COUNTRIES, GENDER } from '../constants/Constants';
import { Card } from 'react-bootstrap'; // Ensure you import Card from react-bootstrap
import { Form, Row, Col, Button, Spinner, InputGroup } from 'react-bootstrap';


const formatOptions = (options) => {
  return options.map((option) => ({ value: option, label: option }));
};

const LinkedInLLMData = ({ data = {}, onSubmit, isLastPage }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [editableData, setEditableData] = useState({ ...data });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (data) {
      setEditableData({ ...data });
    }
  }, [data]);

  const handleChange = (key, value) => {
    setEditableData((prevData) => ({ ...prevData, [key]: value }));
  };

  const renderDropdown = (key, value, options) => {
    return (
      <Select
        value={options.find((option) => option.value === value)}
        onChange={(selectedOption) => handleChange(key, selectedOption?.value || '')}
        options={options}
        isSearchable
        placeholder="Select..."
        aria-label={key}
        className=""
      />
    );
  };

const handleSubmit = async () => {
  setLoading(true);
  setErrorMessage('');

  // Define required fields
  const requiredFields = [
    'firstName', 'lastName', 'displayName', 'gender', 'ethnicity', 'religion', 'currLocation', 'currentCityTier'
  ];

  const labelKeyMap = {
    firstName: "First Name",
    lastName: "Last Name",
    displayName: "Preferred Name",
    age: "Age",
    gender: "Gender",

    ethnicity: "Ethnicity",
    ethnicityCustom: "Custom Ethnicity",
    religion: "Religion",
    religionCustom: "Custom Religion",
    countryOfOrigin: "Country of Origin",
    countryOfOriginCustom: "Custom Country of Origin",

    currLocation: "Current Location",
    currentCityTier: "Location Type",
    prevLocation: "Previous Location(s)",
    currOrg: "Current Organization",
    expCurrOrg: "Current Organization Experience",
    expCurrOrgBucket: "Current Organization Experience Level",
    expTotal: "Total Experience",
    expBucket: "Total Experience Level",
    college: "College",
    collegeGrade: "College Grade",
    profileSummary: "Profile Summary",
    behaviorSummary: "Behavior Summary"
  };

  // Function to check if a field is empty or has an invalid value
  const isInvalid = (value) => {
    return !value || value.trim() === '' || value === 'Unrecognised' || value === 'Unknown';
  };

  // Check for missing or invalid required fields
  const emptyFields = requiredFields.filter((field) => isInvalid(editableData[field])).map((field) => labelKeyMap[field]);

  // Additional validation for custom fields when "Other" is selected
  if (editableData.ethnicity === "Other" && isInvalid(editableData.ethnicityCustom)) {
    emptyFields.push(labelKeyMap('ethnicityCustom'));
  }
  if (editableData.religion === "Other" && isInvalid(editableData.religionCustom)) {
    emptyFields.push(labelKeyMap('religionCustom'));
  }
  if (editableData.countryOfOrigin === "Other" && isInvalid(editableData.countryOfOriginCustom)) {
    emptyFields.push(labelKeyMap('countryOfOriginCustom'));
  }

  if (emptyFields.length > 0) {
    setErrorMessage(`Please fill in all required fields: ${emptyFields.join(', ')}`);
    setLoading(false);
    return;
  }

  try {
    // Replace "Other" with custom values
    if (editableData.ethnicity === "Other") {
      editableData.ethnicity = editableData.ethnicityCustom;
    }
    if (editableData.religion === "Other") {
      editableData.religion = editableData.religionCustom;
    }
    if (editableData.countryOfOrigin === "Other") {
      editableData.countryOfOrigin = editableData.countryOfOriginCustom;
    }

    await onSubmit(editableData);
    setShowSuccessMessage(true);

    // Reload if needed
    const activeMenu = document.getElementsByClassName("pg-menu active")[0];
    if (activeMenu && activeMenu.dataset.title === "myprofile") {
      window.location.reload();
    }
  } catch (error) {
    console.error('Error during submission:', error);
  } finally {
    setLoading(false);
  }
};





  if (!editableData) return null;

  return (
    <div className="response-data p-0">
      <div className="">Here are the extracted details. Please review and update them to ensure they are accurate and complete.”</div>
      <Form>
        <div className="profile-review-card fw-semibold mt-2 mb-2">
          <div className="profile-review-label fs-14">Personal Information</div>
          <div className="p-2">
                            {[
                              {key: 'firstName', label: 'First Name', type: 'text'},
                              {key: 'lastName', label: 'Last Name:', type: 'text' },
                              {key: 'displayName', label: 'Preferred Name:', type: 'text'},
                              {key: 'age', label: 'Age:', type: 'number'},
                              {key: 'gender', label: 'Gender:', options: GENDER},
                            ].map(({key, label, type, options}, index) => (
                                <Form.Group key={key} className="mb-1 fs-12 fw-semibold">
                                  <label>{label}</label>
                                  {options ? (
                                      renderDropdown(key, editableData[key], formatOptions(options))
                                  ) : (
                                      <Form.Control
                                          type={type}
                                          value={editableData[key] || ''}
                                          onChange={(e) => handleChange(key, e.target.value)}
                                          className="form-control-sm"
                                      />
                                  )}
                                </Form.Group>

            ))}
          </div>
        </div>

       <div className="profile-review-card fw-semibold mb-2">
         <div className="profile-review-label fs-14">Demographics</div>
         <div className="p-2">
           {[
              {
                key: 'ethnicity',
                label: 'Ethnicity:',
                options: editableData['ethnicity'] && editableData['ethnicity'] != "unknown" && !ETHNICITIES.includes(editableData['ethnicity'])
                  ? [...ETHNICITIES, editableData['ethnicity']]
                  : ETHNICITIES
              },
              {
                key: 'religion',
                label: 'Religion:',
                options: editableData['religion'] && editableData['religion'] != "unknown" && !RELIGIONS.includes(editableData['religion'])
                  ? [...RELIGIONS, editableData['religion']]
                  : RELIGIONS
              },
              {
                key: 'countryOfOrigin',
                label: 'Country of Origin:',
                options: editableData['countryOfOrigin'] && editableData['countryOfOrigin'] != "unknown" && !COUNTRIES.includes(editableData['countryOfOrigin'])
                  ? [...COUNTRIES, editableData['countryOfOrigin']]
                  : COUNTRIES
              }
            ]
           .map(({ key, label, options }) => (
             <Form.Group key={key} className="mb-1 fs-12 fw-semibold">
               <label>{label}</label>
               <>
                 {/* Dropdown for predefined options */}
                 <Form.Select
                   value={editableData[key] === 'Other' ? 'Other' : editableData[key] || ''}
                   onChange={(e) => {
                     const value = e.target.value;
                     if (value === 'Other') {
                       handleChange(key, 'Other'); // Mark "Other" as selected
                       handleChange(`${key}Custom`, ''); // Reset custom field
                     } else {
                       handleChange(key, value); // Set selected value
                       handleChange(`${key}Custom`, null); // Clear custom field
                     }
                   }}
                   className="form-control-sm"
                 >
                  {editableData[key]=="unknown" ? <option value="">Select an option</option> : ""}
                   {options.map((option, idx) => (
                     <option key={idx} value={option}>
                       {option}
                     </option>
                   ))}
                   <option value="Other">Other</option>
                 </Form.Select>

                 {/* Text box for custom input when "Other" is selected */}
                 {editableData[key] === 'Other' && (
                   <Form.Control
                     type="text"
                     placeholder={`Enter custom ${label.toLowerCase()}`}
                     value={editableData[`${key}Custom`] || ''}
                     onChange={(e) => {
                       const customValue = e.target.value;
                       handleChange(`${key}Custom`, customValue); // Update custom field
                     }}
                     className="form-control-sm mt-2"
                     required
                   />
                 )}
               </>
             </Form.Group>
           ))}
         </div>
       </div>

       <div className="profile-review-card fw-semibold mb-2">
         <div className="profile-review-label fs-14">Additional Information</div>
         <div className="p-2">
           {[
             { key: 'currLocation', label: 'Current Location:' },
             { key: 'currentCityTier', label: 'Location Type:', isDropdown: true, options: ['Metro', 'City', 'Town', 'Rural', 'Unknown'] },
             { key: 'prevLocation', label: 'Previous Location(s):' },
             { key: 'currOrg', label: 'Current Organization:' },
             { key: 'expCurrOrg', label: 'Current Organization Experience :' },
             { key: 'expCurrOrgBucket', label: 'Current Organization Experience Level:' ,isDropdown: true, options: ['New Comer', 'Settled', 'Experienced','Unknown'] },
             { key: 'expTotal', label: 'Total Experience:' },
             { key: 'expBucket', label: 'Total Experience Level:',isDropdown: true,  options: ['Beginner', 'Intermediate', 'Experienced','Veteran','Unknown'] },
             { key: 'college', label: 'College:' },
             { key: 'collegeGrade', label: 'College Grade:', isDropdown: true, options: ['A', 'B', 'C','Unknown'] },
             { key: 'profileSummary', label: 'Profile Summary:', isTextarea: true },
             { key: 'behaviorSummary', label: 'Behavior Summary:', isTextarea: true },
           ].map(({ key, label, isTextarea, isDropdown, options }) => (
             <Form.Group key={key} className="mb-1 fs-12 fw-semibold">
               <label>{label}</label>
               {isTextarea ? (
                 <Form.Control
                   as="textarea"
                   className="form-control-sm"
                   value={editableData[key] || ''}
                   onChange={(e) => handleChange(key, e.target.value)}
                 />
               ) : isDropdown ? (
                 <Form.Select
                   className="form-control-sm "
                   value={editableData[key] || ''}
                   onChange={(e) => handleChange(key, e.target.value)}
                 >
                   <option value="">Select...</option>
                   {options.map((option, idx) => (
                     <option key={idx} value={option}>
                       {option}
                     </option>
                   ))}
                 </Form.Select>
               ) : (
                 <Form.Control
                   type="text"
                   className="form-control-sm"
                   value={editableData[key] || ''}
                   onChange={(e) => handleChange(key, e.target.value)}
                 />
               )}
             </Form.Group>
           ))}
         </div>
       </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="text-end">
          <Button className="btn-gray btn-sm" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' '}Finishing...
              </>
            ) : isLastPage ? (
              'Finish'
            ) : (
              <>
                Next <i className="fa-solid fa-forward"></i>
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};


export default LinkedInLLMData;
