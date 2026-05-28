import React, { useEffect, useState } from 'react';
import { fetchPersonaList } from '../../API/persona/PersonaAPI';
import PanelLabel from '../PanelLabel/PanelLabel';
import './InsightPersonaList.css';
import { NavLink } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import ImageComponent from '../../components/ImageComponent';
import ErrorModal from '../Modal/ErrorModal';
import MessageComponent from '../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../API/Config/AppConfig';
import NotificationBar from "../../pages/addmember/NotificationBar";


const InsightPersonaList = ({ onPersonaSelect, onScreenChange, status }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const UserGuideURL = APP_URL + "/user-guide"

  useEffect(() => {
    const loadPersonas = async () => {
      setLoading(true);
      try {
        const personaList = await fetchPersonaList();
        setPersonas(personaList);
      } catch (error) {
        console.error('Error fetching personas:', error);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPersonas();
  }, []);

  const handleMenuClick = (event, message) => {
    console.log(message);
    document.querySelectorAll('li.active').forEach((el) => el.classList.remove('active'));
    document.getElementById('ActiveTabTitle').innerHTML = message;
  };


  const filteredPersonas = personas.filter(
      (item) =>
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Flag to control conditional rendering
  const isLimitedView = status?.[1]?.toUpperCase() === 'PGFREE';
  const currentStatus = status?.[0]?.toUpperCase() !== 'ACTIVE';
  const size = personas?.length;

  return (
    <>
      {personas.length == 0 && !loading &&
        (
          <div className="demo-notification-bar">
            <NotificationBar
              message="How to create Persona? Click here to watch and learn!"
              link={UserGuideURL}
            />
          </div>
        ) }
          <div className={`p-2`}>
            <PanelLabel text="Understand, Connect, and Engage Better"/>
            <div>
              Get tailored personality insights, behavioral traits, and icebreakers to spark meaningful conversations
              and build stronger bonds with your network
            </div>
            <div className="insight-search-container">
              <div className="search-container">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Members"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <div>
                <NavLink
                  to="#"
                  onClick={(event) => {
                    handleMenuClick(event, 'Add Members');
                    onScreenChange('addmember');
                  }}
                  className="fs-1"
                >
                  <i
                    className="fa-regular fa-square-plus fs-1 panel-label"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Add Persona"
                  ></i>
                </NavLink>
              </div>
            </div>
            <div className="persona-list">
              {loading ? (
                <div className="loading-spinner">
                  <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon"/>
                </div>
              ) : (
                <>
                  {((isLimitedView && size >= 5) || currentStatus) ? (
                    // Show only 5 personas with blurred background
                    <>
                      <div className="limited-view-container">
                        {filteredPersonas.slice(0, 5).map((persona) => (
                          <div key={persona.userId} className="persona-card" onClick={() => onPersonaSelect(persona)}>
                            <ImageComponent name={persona.username} className="persona-avatar"/>
                            <div className="persona-info">
                              <h3>{persona.fullName}</h3>
                              <p className="persona-username">{persona.title}</p>
                              {persona.relation !== 'me' ?
                                <p className="persona-username">{persona.relation}</p> : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <MessageComponent message="upgrade" flag={true}
                                          onButtonClick={() => chrome.tabs.create({url: APP_URL + '/plans/active'})}/>
                      </div>
                    </>
                  ) : filteredPersonas.length > 0 ? (
                    filteredPersonas.map((persona) => (
                      <div key={persona.userId} className="persona-card" onClick={() => onPersonaSelect(persona)}>
                        <ImageComponent name={persona.username} className="persona-avatar"/>
                        <div className="persona-info">
                          <h3>{persona.fullName}</h3>
                          <p className="persona-username">{persona.title}</p>
                          {persona.relation !== 'me' ? <p className="persona-username">{persona.relation}</p> : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-message">No Personas found.</div>
                  )}
                </>
              )}
            </div>
            <ErrorModal
              isOpen={showError}
              onClose={() => setShowError(false)}
              errorMessage="We're having trouble loading your personas."
              networkIssue={true}
              sticky={true}
            />
          </div>
        </>
        );
      };

      export default InsightPersonaList;
