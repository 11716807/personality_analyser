import React, { useState } from 'react';
import { Form, Button , Spinner} from 'react-bootstrap';
import linkedinProfileDownlodGIF from '../../../assets/img/linked-profile-download.gif';
import ownLinkedInProfileDownload from '../../../assets/img/ownLinkedInProfileDownload.gif';
import DragAndDropFileUpload from "../../../components/DragDropFileUpload";
import MessageComponent from "../constants/MessageComponent";
import { APP_URL } from '../../../API/Config/AppConfig';

const FileUploader = ({ onFileSelect, onFileSubmit, onNext, uploadMessage, isSubmitting, isLoggedInUser ,loading}) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [knowledge, setKnowledge] = useState(isLoggedInUser ? 1 : ''); // Ensure default value is properly set
  const [relationship, setRelationship] = useState(isLoggedInUser ? 'me' : '');
  const [isVisible, setIsVisible] = useState(false);
  const [isLinkedinGuide, setIsLinkedinGuide] = useState(false);

  const knowledgeOptions = [
    { id: 1, label: 'Select an option' },
    { id: 2, label: 'Never met him/her' },
    { id: 3, label: 'Connected virtually a couple of times' },
    { id: 4, label: 'Only know him/her professionally' },
    { id: 5, label: 'Know him/her personally as well' },
    { id: 6, label: 'I know him/her very well' },
  ];

  const relationshipOptions = [
    'Colleague',
    'Customer',
    'Friend',
    'Mentor',
    'Manager',
    'Team Member',
    'Business Partner',
    'Classmate',
    'Acquaintance',
    'Neighbor',
    'Family Member',
    'Consultant',
    'Advisor',
    'Investor',
    'Vendor',
    'Intern',
    'DirectReport',
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      setFileSelected(true);
    }
  };

  const handleSubmit = () => {
    const payload = { knowledge, relationship };
    onFileSubmit(payload);
  };

  return (
      <>
    {!isLinkedinGuide && (
    <div className="">
      <div md={{ span: 6, offset: 3 }}>
          {isLoggedInUser ?
              ( <p className="text-darkslategray">
                        Upload your "Linked<i className="fa-brands fa-linkedin"></i> profile extract"  or resume to unlock a deeper understanding of your personality, behavioral traits, and unique strengths.
                       </p>):
              ( <p className="text-darkslategray">
                       Upload "Linked<i className="fa-brands fa-linkedin"></i> profile extract"  or resume of your connections to build deeper and more meaningful connections with them
                       </p>)
                       }

        <Form className="p-1 rounded mb-2">
          <Form.Group controlId="fileUpload">
            <DragAndDropFileUpload setIsVisible={setIsVisible} onFileSelect={handleFileChange}/>
            {/*<Form.Label>
              Upload Profile<i className="fa-solid fa-star-of-life text-danger fa-2xs"></i>
            </Form.Label>
            <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={isSubmitting} />
            */}
          </Form.Group>

          {/* Only show dropdowns if user is not logged in */}
          <div id="CreateProfileQuestion">
          {!isLoggedInUser && isVisible && (
            <>
              <Form.Group controlId="knowledgeDropdown" className="mt-2">
                <label className="fs-14 fw-bold text-muted">
                  How well do you know this person?<i className="fa-solid fa-star-of-life text-danger fa-2xs"></i>
                </label>
                <Form.Control
                  className="form-select"
                  as="select"
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  disabled={isSubmitting}
                >
                  {knowledgeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="relationshipDropdown" className="mt-2">
                <label className="fs-14 fw-bold text-muted">
                  Select your connection type <i className="fa-solid fa-star-of-life text-danger fa-2xs"></i>
                </label>
                <Form.Control
                  as="select"
                  className="form-select"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select an option</option>
                  {relationshipOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </>
          )}
          </div>

          {/* If logged in, don't show dropdowns but set default values */}
          {isLoggedInUser && isVisible && (
            <>
              <input type="hidden" value="me" onChange={(e) => setKnowledge(1)} />
              <input type="hidden" value="me" onChange={(e) => setRelationship('me')} />
            </>
          )}
          {!isVisible && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-gray mt-3"
                  onClick={() => setIsLinkedinGuide(true)}
                >
                  How to Extract Linked<i className="fa-brands fa-linkedin"></i> Profile?
                </button>
              </div>
          )}
          {isVisible && (
            <div className="text-end">
              <button
                  className="btn text-white btn-gray btn-sm mt-2"
                  disabled={
                    isLoggedInUser
                        ? !fileSelected || isSubmitting
                        : !fileSelected || !knowledge || !relationship || isSubmitting
                  }
                  onClick={handleSubmit}
              >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              {' '}Submitting...
                            </>
                          ) : (
                            <>
                              Next <i className="fa-solid fa-angles-right"></i>
                            </>
                          )}
              </button>
            </div>
          )}
          {uploadMessage && (
            <div className={`alert p-2 mt-2 ${uploadMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
             <MessageComponent message = {uploadMessage} flag={true} onButtonClick={() => chrome.tabs.create({ url: APP_URL + '/plans/active' })}
                 />
            </div>
          )}
        </Form>
      </div>
    </div>
  )}
  {isLinkedinGuide && (
      <div className="linkedin-profile-download">
        <div className="align-content-center justify-content-center">
          <div className="float-end btn btn-sm btn-outline-secondary linkedin-guide-close" onClick={() => setIsLinkedinGuide(false)}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="fw-semibold mt-1">
            <i className="fa-solid fa-circle-info"></i> How to Download Linked<i className="fa-brands fa-linkedin"></i> Profile?
          </div>
        </div>
        <div className="mt-2">
          {isLoggedInUser ? (<img src={ownLinkedInProfileDownload} width="100%"/>)
          : (<img src={linkedinProfileDownlodGIF} width="100%"/>)}
        </div>
        {isLoggedInUser ?
        (<>
        <div className="mt-1">1. Navigate to your LinkedIn profile.</div>
        <div className="mt-1">
          2. On Your profile page, click the <b>"Resources"</b> button located near your profile photo and name.
        </div>
        <div className="mt-1">
          3. From the dropdown menu, select <b>"Save to PDF"</b>. LinkedIn will automatically generate and download a
          PDF version of your profile.
        </div>
        </>):
        (<>
        <div className="mt-1">1. Navigate to the LinkedIn profile of the person you want to download.</div>
        <div className="mt-1">
          2. On their profile page, click the <b>"More"</b> button located near their profile photo and name.
        </div>
        <div className="mt-1">
          3. From the dropdown menu, select <b>"Save to PDF"</b>. LinkedIn will automatically generate and download a
          PDF version of their profile.
        </div>
        </>)}
      </div>
  )}
      </>
  );
};

export default FileUploader;
