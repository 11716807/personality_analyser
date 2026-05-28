import React, { useState, useEffect } from "react";
import { Accordion, Modal, Spinner, Alert } from "react-bootstrap";
import { axiosInstance } from "../../API/CustomAxiosConfig";
import { formatDate } from "../../API/DateFormater";

const ChannelAccordion = ({ persona }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [userLoading, setUserLoading] = useState(false); // ✅ Separate loading for modal

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        console.log(`Persona info: ${JSON.stringify(persona)}`);
        const { data } = await axiosInstance.get(`/channels/top-channels/persona/${persona.username}`);
        setChannels(data);
      } catch (err) {
        setError("Failed to fetch channels");
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [persona.username]);

  const fetchUserInfo = async (channelName, runTime, user) => {
    setShowModal(true);
    setUserInfo(null);
    setSelectedUser(user.name);
    setUserLoading(true); // ✅ Show spinner while fetching user data

    try {
      const { data } = await axiosInstance.post("/channels/channeluserclick", {
        channelName,
        runTime,
        user,
      });
      setUserInfo(data);
    } catch (err) {
      setError("Failed to fetch user info");
    } finally {
      setUserLoading(false); // ✅ Stop spinner when request completes
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : channels.length === 0 ? (
        <div className="p-2">
          <div className="fs-6 text-secondary text-center fw-bold mb-3">No Channel Summary Found</div>
          <div className="fw-semibold">
                <div>Follow These Steps to generate an individual summary:</div>
              </div>
              <p className="fs-14 text-muted">
                <span className="fw-bold text-orange">1. Create a PsyGenie Channel:</span>&nbsp;
                Go to the Channels window and create a new channel.
              </p>

              <p className="fs-14 text-muted">
                <span className="fw-bold text-orange">2. Open a Communication App:</span>&nbsp;
                Choose one from Slack, Gmail, LinkedIn, Microsoft Teams, or WhatsApp.
              </p>

              <p className="fs-14 text-muted">
                <span className="fw-bold text-orange">3. Select & Add Messages:</span>&nbsp;
                Pick a relevant message and add it to your created channel.
              </p>
              <p className="fs-14 text-muted">
                <span className="fw-bold text-orange">4. Analyze Your Selected Messages:</span>&nbsp;
                Run the analysis to analyze user engagement, interactions, and psychological insights based on the selected messages.
              </p>
              <p className="fs-14 text-muted">
                <span className="fw-bold text-orange">5. Tag Your Persona Users:</span>&nbsp;
                Assign relevant persona users to the analyzed results for better insights.
              </p>
        </div>
      ) : (
        <Accordion defaultActiveKey="0">
          {channels.map((channel, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={channel.channelName || idx}>
              <Accordion.Header>{channel.channelName}</Accordion.Header>
              <Accordion.Body>
                {channel.topRuns?.length > 0 ? (
                  channel.topRuns.map((run, runIdx) =>
                    run.users?.map((user, userIdx) => (
                      <div
                        key={`${run.runTime}-${userIdx}`} // ✅ Unique key fix
                        className="profile-row d-flex justify-content-between align-items-center p-2 mb-2 border rounded"
                        onClick={() => fetchUserInfo(channel.channelName, run.runTime, user)}
                        style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
                      >
                        <span className="label">
                          <strong className="text-orange">Insights From:</strong> {formatDate(run.runTime, true)}
                          <i className="fa-solid fa-arrow-up-right-from-square ms-2"></i>
                        </span>
                      </div>
                    ))
                  )
                ) : (
                  <p className="text-muted">No runs available.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
        <Modal  className="pg-bootstrap-model" show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title className="h6">Psychological Profile and Behavioral Insights</Modal.Title>
              </Modal.Header>
              <Modal.Body className="custom-scrollbar">
                {userLoading ? (
                  <Spinner animation="border" className="d-block mx-auto" />
                ) : userInfo && userInfo.participantDetails ? (
                  <>
                    <div className="modal-body-insight">
                      <strong className="text-orange">Role:</strong> {userInfo.participantDetails.role || "Role not specified"}
                    </div>

                    {/* Communication Style */}
                    {userInfo.participantDetails.communication_style && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Communication Style:</strong>
                        <p>{userInfo.participantDetails.communication_style.description || "No description available."}</p>
                        {Array.isArray(userInfo.participantDetails.communication_style.examples) &&
                        userInfo.participantDetails.communication_style.examples.length > 0 ? (
                          <>
                            <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                            <ul className="fs-14">
                              {userInfo.participantDetails.communication_style.examples.map((example, index) => (
                                <li key={`comm-style-${index}`} className="text-muted">"{example}"</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="text-muted">No examples available.</p>
                        )}
                      </div>
                    )}

                    {/* Decision Making */}
                    {userInfo.participantDetails.decision_making && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Decision Making:</strong>
                        <p>{userInfo.participantDetails.decision_making.description || "No description available."}</p>
                        {Array.isArray(userInfo.participantDetails.decision_making.examples) &&
                        userInfo.participantDetails.decision_making.examples.length > 0 ? (
                          <>
                            <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                            <ul className="fs-14">
                              {userInfo.participantDetails.decision_making.examples.map((example, index) => (
                                <li key={`decision-making-${index}`} className="text-muted">"{example}"</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="text-muted">No examples available.</p>
                        )}
                      </div>
                    )}

                    {/* Emotional Expression */}
                    {userInfo.participantDetails.emotional_expression && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Emotional Expression:</strong>
                        <p>{userInfo.participantDetails.emotional_expression.description || "No description available."}</p>
                        {Array.isArray(userInfo.participantDetails.emotional_expression.examples) &&
                        userInfo.participantDetails.emotional_expression.examples.length > 0 ? (
                          <>
                            <strong className="fs-12 fw-semibold">Relevant Messages</strong>
                            <ul className="fs-14">
                              {userInfo.participantDetails.emotional_expression.examples.map((example, index) => (
                                <li key={`emotional-expression-${index}`} className="text-muted">"{example}"</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="text-muted">No examples available.</p>
                        )}
                      </div>
                    )}

                    {/* Engagement Level */}
                    <div className="modal-body-insight">
                      <strong className="text-orange">Engagement Level:</strong>
                      <p>{userInfo.participantDetails.engagement_level || "Not available."}</p>
                    </div>

                    {/* Hidden Traits */}
                    {userInfo.participantDetails.hidden_traits && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Hidden Traits:</strong>
                        <p>{userInfo.participantDetails.hidden_traits.description || "No hidden traits identified."}</p>
                      </div>
                    )}

                    {/* Potential Risks */}
                    {userInfo.participantDetails.potential_risks && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Potential Risks:</strong>
                        <p>{userInfo.participantDetails.potential_risks.description || "No risks identified."}</p>
                      </div>
                    )}

                    {/* Psychologist Insight */}
                    {userInfo.participantDetails.psychologist_insight && (
                      <div className="modal-body-insight">
                        <strong className="text-orange">Psychologist Insight:</strong>
                        <p>{userInfo.participantDetails.psychologist_insight || "No insights available."}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted">No data available.</p>
                )}
              </Modal.Body>
            </Modal>
    </div>
  );
};

export default ChannelAccordion;