import React, { useState } from 'react';
import AccordionItem from '../AccordionItem';
import { StrengthChallenge } from '../Behaviour';
import { axiosInstance } from '../../../API/CustomAxiosConfig';
import { fetchInteractionQA } from '../../../API/persona/PersonaAPI';
import { FaClipboardQuestion } from "react-icons/fa6";
import ReactMarkdown from 'react-markdown';
import MessageComponent from '../../../pages/addmember/constants/MessageComponent';
import { APP_URL } from '../../../API/Config/AppConfig';
import { FcCancel , FcOk} from "react-icons/fc";


const BehaviorTab = ({ personality, dos, donts, interactions, profile }) => {
  const [subItems, setSubItems] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const handleExpand = async (userName, item, index) => {
    console.log("call handleExpand") ;
    if (subItems[index]) return;
    console.log("set states for handleExpand") ;
    setLoading((prev) => ({ ...prev, [index]: true }));
    setError((prev) => ({ ...prev, [index]: null }));

    try {
      console.log("call fetchInteractionQA");
      const data = await fetchInteractionQA(userName, item, index);
      setSubItems((prev) => ({ ...prev, [index]: { user: userName, title: item, data } }));
    } catch (err) {
      console.log("error : {}", err);
      const errorMessage = err.response?.data?.message || 'Failed to load sub-items. Please retry.';
      setError((prev) => ({ ...prev, [index]: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <>
      <div className="accordion" id="BehaviorSummaryAccordion">
        {/* Behavior Summary Panel */}
        {profile?.behaviorSummary && (
          <AccordionItem
            id="BehaviorSummaryAccordion"
            parentId="BehaviorSummaryAccordion"
            title={
              <>
              <span className="fw-bold fs-14">
                <i className="fa-solid fa-book-open"></i>&nbsp;Behavior Summary
              </span>
              </>
            }
            content={
              <div className="behavior-summary fs-14">
                <p>{profile.behaviorSummary}</p>
              </div>
            }
            isVisible={true} // Behavior Summary is visible by default
          />
        )}
      </div>

      {/* Strength & Challenge Panel */}
      <div className="accordion" id="StrengthChallengeAccordion">
        {personality && (
          <AccordionItem
            id="StrengthChallenge"
            parentId="StrengthChallengeAccordion"
            title={
              <>
              <span className="fw-bold fs-14">
                <i className="fa-solid fa-person-running"></i>&nbsp;Strength & Challenge
              </span>
              </>
            }
            content={<StrengthChallenge personality={personality}/>}
            isVisible={true}
          />
        )}
      </div>
      {/* Dos Panel */}
      <div className="accordion" id="DosAccordion">
        {dos && (
          <AccordionItem
            id="Dos"
            parentId="DosAccordion"
            title={
              <>
              <span className="fw-bold fs-14">
                <i className="fa-solid fa-check-circle"></i>&nbsp;Dos
              </span>
              </>
            }
            content={
              <div className="guidelines-section">
                {dos.map((item, index) => (
                  <div key={index} className="guideline-item">
                    <li><FcOk/>&nbsp;{item}</li>
                  </div>
                ))}
              </div>
            }
            isVisible={true}
          />
        )}
      </div>

      {/* Don'ts Panel */}
      <div className="accordion" id="DontsAccordion">
        {donts && (
          <AccordionItem
            id="Donts"
            parentId="DontsAccordion"
            title={
              <>
              <span className="fw-bold fs-14">
                <i className="fa-solid fa-times-circle"></i>&nbsp;Don'ts
              </span>
              </>
            }
            content={
              <div className="guidelines-section">
                {donts.map((item, index) => (
                  <div key={index} className="guideline-item">
                    <li><FcCancel/>&nbsp;{item}</li>
                  </div>
                ))}
              </div>
            }
            isVisible={true}
          />
        )}
      </div>
      {interactions?.length > 0 && (
        <div className="interactions-section">
          {interactions.map((item, index) => (
            <div className="accordion"  id={`InteractionAccordion-${index}`}>
            <AccordionItem
              key={`accordion-${index}`}
              id={`Interaction-${index}`}
              parentId={`InteractionAccordion-${index}`}
              title={
                <span
                  className="fw-bold fs-14"
                  onClick={() => handleExpand(profile?.personaUserName, item, index)}
                >
          <i className="fa-solid fa-hand-holding-hand"></i> &nbsp;
                  {(
                    item
                  )}
          </span>
              }
              content={
                loading[index] ?
                  (
                    <i className="fa fa-spinner fa-spin"></i> // Add spinner icon
                  ) :
                  subItems[index]?.data ? (
                    <div className="interaction-content">
                      <ReactMarkdown>{subItems[index]?.data}</ReactMarkdown>
                    </div>
                  ) : error[index] ? (
                  <div className="alert p-2 mt-2 alert-danger">
                     <MessageComponent message = {error[index]} flag={true} onButtonClick={() => chrome.tabs.create({ url: APP_URL + '/plans/active' })}
                          />
                     </div>
                  ):(
                      <p> data not available. </p>
                 )
              }
              isVisible={false}
            />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BehaviorTab;
