import React, {useEffect, useState} from "react";
import "../Insight/InsightPersonaSelected.css";
import ImageComponent from "../../components/ImageComponent";
import {fetchPersona} from "../../API/persona/PersonaAPI";
import pp01 from "../../assets/img/pp01.png";

const ChannelUsers = ({ run, fetchUserInfo, handleTagUser}) => {
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
        {(!user.personaUserId) ? (
          <div key={idx} className="mb-2 border-bottom py-1 ">
            <div className="d-flex justify-content-between ">
              <div>

                  <>
                    <div className="channel-persona">
                      <div className="channel-persona-image"><img
                        src={pp01} width={20}
                        alt={name} className="border-1"/>
                      </div>
                      <div>
                        <h6 className="mb-0 text-gray-link fs-14 nav-link fw-semibold"
                            onClick={() => user.name && fetchUserInfo?.(user, run.runTime)}>{user.name || "Unknown User"}</h6>
                        <small className="text-muted">External User</small>
                      </div>
                    </div>
                  </>
              </div>
              <a
                className="me-2 text-gray-link"
                onClick={() => handleTagUser(user.name)}
              ><i className="fa-solid fa-user-tag"></i>
              </a>
            </div>
          </div>
          ) : (<></>)}
          </>
      ))
  );
};

export default ChannelUsers;
