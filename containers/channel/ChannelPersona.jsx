import React, {useEffect, useState} from "react";
import "../Insight/InsightPersonaSelected.css";
import ImageComponent from "../../components/ImageComponent";
import {fetchPersona} from "../../API/persona/PersonaAPI";

const ChannelPersona = ({ run, fetchUserInfo, handleTagUser}) => {
  function getPersonaTitle(username) {
    const [title, setTitle] = useState("Loading...");
    useEffect(() => {
      async function fetchTitle() {
        const persona = await fetchPersona(username);
        setTitle(persona.title); // Updates state with the title
      }
      fetchTitle();
    }, [username]);

    console.log(title);
    return title;
  }

  // Usage
  function PersonaTitle({ user, fetchUserInfo }) {
    const title = getPersonaTitle(user.personaUserId);
    return <small className="text-muted">{title}</small>;
  }

  return (
    run.users.map((user, idx) => (
      <>
        {(user.personaUserId) ? (
      <div key={idx} className="mb-2 border-bottom py-1 ">
        <div className="d-flex justify-content-between ">
          <div>
                {fetchPersona(user.personaUserId) && (
                  <>
                    <div className="channel-persona ">
                      <div className="channel-persona-image">
                        <ImageComponent name={user?.personaUserId || 'Unknown'}
                                        className="persona-avatar"/>
                      </div>

                      <div>
                        <h6 className="mb-0 text-orange-link fs-14 fw-semibold"
                            onClick={() => user.name && fetchUserInfo?.(user, run.runTime)}>{user.personaName || "Unknown User"}</h6>
                        <div className="fw-semibold"><PersonaTitle user={user}/></div>
                          <small className="text-muted d-block mt-0">Chat Alias: {user.name}</small>
                      </div>
                    </div>
                  </>
                )}
          </div>
          <a
            className="me-2 text-orange-link"
            onClick={() => handleTagUser(user.name)}
          ><i className="fa-solid fa-user-pen"></i>
          </a>
        </div>
      </div>
        ):(<></>)}
        </>
    ))
  )
}

export default ChannelPersona;
