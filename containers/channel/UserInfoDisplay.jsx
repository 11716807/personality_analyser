import React, {useEffect, useState} from "react";
import {Alert, Button, Form, Modal, Spinner} from "react-bootstrap";
import {axiosInstance} from "../../API/CustomAxiosConfig";
import AnalysisLoader from "./AnalysisLoader";
import AccordionItem from "../Insight/AccordionItem";
import ChannelCard from "./ChannelCard";
import {fetchChannelData, fetchPersona, fetchPersonaList} from '../../API/persona/PersonaAPI';
import {formatDate} from "../../API/DateFormater";
import ImageComponent from "../../components/ImageComponent";
import ChannelUsers from "./ChannelUsers";
import ChannelPersona from "./ChannelPersona";
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';

const UserInfoDisplay = ({ response, editButton , channel, loggedInUserPersona, newError}) => {
  const [expandedRun, setExpandedRun] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [content, setContent] = useState(null);
  useEffect(() => {
    async function loadContent() {
      setContent(response);
    }
    loadContent();
  }, [response]);


  const fetchUserInfo = async (user, runTime) => {
    setUserInfo(null);
    if (user.personaUserId) {
      setSelectedUser(user.personaName)
    } else {
      setSelectedUser(user.name);
    }
    setShowModal(true);
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post("/channels/channeluserclick", {
        channelName: response.channelName,
        runTime: runTime,
        user: {
          name: user.name,
          type: user.type,
          personaUserId: user.personaUserId,
        },
      });
      setUserInfo(data);
    } catch (err) {
      setError("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  };


  const fetchPersonas = async () => {
    try {
      console.log("loggedInUserPersona : {}", loggedInUserPersona);
      const data = await fetchPersonaList();
      setPersonas([...data, loggedInUserPersona]);
    } catch (err) {
      console.log("error for list of personas {}", err);
      setError("Failed to fetch personas");
    }
  }


  const handleTagUser = (userName) => {
    setShowTagModal(true);
    setSelectedUser(userName);
    fetchPersonas();
  };

  const handleSubmitTag = async (event, unlink = false) => {
    event.preventDefault();

    if (!unlink && !selectedTag) {
      alert("Please select a personality before submitting.");
      return;
    }

    const tagToSubmit = unlink ? "unlink" : selectedTag;

    try {
await axiosInstance.post(`/channels/tag-account?username=${encodeURIComponent(tagToSubmit)}&accountName=${encodeURIComponent(selectedUser)}&channelName=${encodeURIComponent(channel.channelName)}`);      setShowTagModal(false);
      response = await fetchChannelData(channel);
      setContent(response);
    } catch (err) {
      setError("Failed to submit tag");
    }
  };


  return (
    <>
      <ChannelCard channelName={channel.channelName} generalSummary={channel.info} editButton={editButton} />
      {(localStorage.getItem(channel.channelName) === "true") && <AnalysisLoader />}
      {newError && (
                                 <div className="alert p-2 mt-2 alert-danger">
                                   <MessageComponent
                                     message={newError}
                                     flag={true}
                                     onButtonClick={() => chrome.tabs.create({url: APP_URL + "/plans/active"})}
                                   />
                                 </div>
                               )}
      <div className="accordion mt-2" id="RunAnalysisAccordion" key={refreshKey}>
        {content?.channelRuns?.map((run, index) => (
          <AccordionItem
            key={index}
            id={`Run${index}`}
            parentId="RunAnalysisAccordion"
            title={
              <span className="fw-bold fs-12">Insights From : {formatDate(run.runTime, true)}
              </span>
            }
            content={
              <>
                <div className="text-orange"><strong>Summary</strong></div>
                <p>{run.summary}</p>
                <div className="mt-3">
                  <div className="fw-bold">Users Involved</div>
                  {(!run.users || run.users.length === 0) ? (
                    <p className="text-muted">No users in this run.</p>
                  ) : (
                    <>

                      <ChannelPersona run={run} fetchUserInfo={fetchUserInfo} handleTagUser={handleTagUser}/>
                      <ChannelUsers run={run} fetchUserInfo={fetchUserInfo} handleTagUser={handleTagUser}/>

                    </>
                  )}
                </div>
              </>
            }
            isVisible={expandedRun === index}
            onClick={() => setExpandedRun(expandedRun === index ? null : index)}
          />
        ))}
      </div>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      <Modal className="pg-bootstrap-model" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6">Psychological Profile and Behavioral Insights</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-scrollbar">
          {loading ? (
            <Spinner animation="border" className="d-block mx-auto" />
          ) : userInfo ? (
            <>
              {/* Participant Details */}
              {userInfo.participantDetails && (
                <>
                  <div className="p-2">
                    Here are <strong>{selectedUser}'s</strong> analyzed engagement insights and interaction patterns:
                  </div>

                  {/* Role */}
                  {userInfo.participantDetails.role && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Role:</strong> {String(userInfo.participantDetails.role)}
                    </div>
                  )}

                  {/* Communication Style */}
                  {userInfo.participantDetails.communication_style && typeof userInfo.participantDetails.communication_style === "object" && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Communication Style:</strong>
                      <p>{typeof userInfo.participantDetails.communication_style.description === "string" ? userInfo.participantDetails.communication_style.description : "No description available."}</p>
                      {Array.isArray(userInfo.participantDetails.communication_style.examples) && userInfo.participantDetails.communication_style.examples.length > 0 ? (
                      <>
                       <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                        <ul className="fs-14">
                          {userInfo.participantDetails.communication_style.examples.map((example, index) => (
                            <li key={`comm-style-${index}`} className="text-muted">"{String(example)}"</li>
                          ))}
                        </ul>
                      </>
                      ) : <p className="text-muted">No examples available.</p>}
                    </div>
                  )}

                  {/* Decision Making */}
                  {userInfo.participantDetails.decision_making && typeof userInfo.participantDetails.decision_making === "object" && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Decision Making:</strong>
                      <p>{typeof userInfo.participantDetails.decision_making.description === "string" ? userInfo.participantDetails.decision_making.description : "No description available."}</p>
                      {Array.isArray(userInfo.participantDetails.decision_making.examples) && userInfo.participantDetails.decision_making.examples.length > 0 ? (
                      <>
                        <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                        <ul className="fs-14">
                          {userInfo.participantDetails.decision_making.examples.map((example, index) => (
                            <li key={`decision-making-${index}`} className="text-muted">"{String(example)}"</li>
                          ))}
                        </ul>
                      </>
                      ) : <p className="text-muted">No examples available.</p>}
                    </div>
                  )}

                  {/* Emotional Expression */}
                  {userInfo.participantDetails.emotional_expression && typeof userInfo.participantDetails.emotional_expression === "object" && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Emotional Expression:</strong>
                      <p>{typeof userInfo.participantDetails.emotional_expression.description === "string" ? userInfo.participantDetails.emotional_expression.description : "No description available."}</p>
                      {Array.isArray(userInfo.participantDetails.emotional_expression.examples) && userInfo.participantDetails.emotional_expression.examples.length > 0 ? (
                       <>
                         <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                         <ul className="fs-14">
                            {userInfo.participantDetails.emotional_expression.examples.map((example, index) => (
                              <li key={`emotional-expression-${index}`} className="text-muted">"{String(example)}"</li>
                            ))}
                         </ul>
                       </>
                      ) : <p className="text-muted">No examples available.</p>}
                    </div>
                  )}

                  {/* Engagement Level */}
                  {userInfo.participantDetails.engagement_level && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Engagement Level:</strong> <p>{String(userInfo.participantDetails.engagement_level)}</p>
                    </div>
                  )}

                  {/* Hidden Traits */}
                  {userInfo.participantDetails.hidden_traits && typeof userInfo.participantDetails.hidden_traits === "object" && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Hidden Traits:</strong>
                      <p>{typeof userInfo.participantDetails.hidden_traits.description === "string" ? userInfo.participantDetails.hidden_traits.description : "No hidden traits identified."}</p>
                      {Array.isArray(userInfo.participantDetails.hidden_traits.examples) && userInfo.participantDetails.hidden_traits.examples.length > 0 ? (
                       <>
                         <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                         <ul className="fs-14">
                            {userInfo.participantDetails.hidden_traits.examples.map((example, index) => (
                              <li key={`hidden-traits-${index}`} className="text-muted">"{String(example)}"</li>
                            ))}
                         </ul>
                       </>
                      ) : <p className="text-muted">No examples available.</p>}
                    </div>
                  )}

                  {/* Potential Risks */}
                  {userInfo.participantDetails.potential_risks && typeof userInfo.participantDetails.potential_risks === "object" && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Potential Risks:</strong>
                      <p>{typeof userInfo.participantDetails.potential_risks.description === "string" ? userInfo.participantDetails.potential_risks.description : "No risks identified."}</p>
                      {Array.isArray(userInfo.participantDetails.potential_risks.examples) && userInfo.participantDetails.potential_risks.examples.length > 0 ? (
                       <>
                       <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                        <ul className="fs-14">
                          {userInfo.participantDetails.potential_risks.examples.map((example, index) => (
                            <li key={`potential-risks-${index}`} className="text-muted">"{String(example)}"</li>
                          ))}
                        </ul>
                        </>
                      ) : <p className="text-muted">No examples available.</p>}
                    </div>
                  )}

                  {/* Psychologist Insight */}
                  {userInfo.participantDetails.psychologist_insight && (
                    <div className="modal-body-insight">
                      <strong className="text-orange">Psychologist Insight:</strong>
                      <p>{String(userInfo.participantDetails.psychologist_insight)}</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-muted">No data available.</p>
          )}
        </Modal.Body>
      </Modal>


      <Modal className="pg-bootstrap-model" show={showTagModal} onHide={() => setShowTagModal(false)} centered style={{ marginLeft: "37px", width:"90%" }}>
        <Modal.Header closeButton>
          <Modal.Title className="h6 text-orange">Link Channel user <strong>{selectedUser}</strong> with the corresponding PsyGenie personality</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 mt-3">
          <Form>
            <Form.Group>
              <Form.Control as="select" className="form-control form-select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">Select Personality</option>
                 {[...personas]
                  .sort((a, b) => a.fullName.localeCompare(b.fullName))
                  .map((persona, idx) => (
                    <option key={idx} value={persona.username}>{persona.fullName}</option>
                ))}
              </Form.Control>
            </Form.Group>
             {/* Button Container */}
                  <div className="d-flex justify-content-end mt-3">
                    {/* Unlink Button */}
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={(event) => handleSubmitTag(event, true)}
                    >
                      Unlink
                    </button>

                    {/* Submit Button */}
                    <button
                      type="button"
                      style={{ backgroundColor: "#FF7D14", border: "none" }}
                      className="btn btn-orange"
                      onClick={(event) => handleSubmitTag(event)}
                    >
                      Submit
                    </button>
                  </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserInfoDisplay;
