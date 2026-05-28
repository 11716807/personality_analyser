import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const UserList = ({ detectedUsers, setDetectedUsers, predefinedUsers }) => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState('');

  // Handle user removal
  const handleRemoveUser = (user) => {
    setDetectedUsers((prevUsers) => prevUsers.filter((u) => u !== user));
  };

  // Handle adding a new user
  const handleAddUser = () => {
    if (newUser.trim() && !detectedUsers.includes(newUser)) {
      setDetectedUsers((prevUsers) => [...prevUsers, newUser.trim()]);
      setNewUser('');
      setIsAddingUser(false);
    }
  };

  return (
    <>
      <div className="fs-14 fw-semibold text-orange mt-2">People Involved</div>
      <div className="detected-users">
        {detectedUsers.length > 0 ? (
          detectedUsers.map((user, index) => (
            <button key={index} className="detected-user-button">
              {user}
              <FontAwesomeIcon
                icon={faTimes}
                className="remove-user-icon"
                onClick={() => handleRemoveUser(user)}
              />
            </button>
          ))
        ) : (
          <div className="messages-placeholder">No users detected.</div>
        )}

        {/* Add user button */}
        <button className="add-user-button" onClick={() => setIsAddingUser(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* Show input box only when adding a user */}
      {isAddingUser && (
        <div className="add-user-input-container">
          <input
            type="text"
            className="add-user-input"
            placeholder="Type or select a username..."
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            list="available-users"
          />
          <datalist id="available-users">
            {predefinedUsers.map((user, index) => (
              <option key={index} value={user} />
            ))}
          </datalist>

          <button className="confirm-add-user-button" onClick={handleAddUser}>
            Add
          </button>

          {/* Cancel button */}
          <button
            className="cancel-add-user-button"
            onClick={() => {
              setNewUser('');
              setIsAddingUser(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </>
  );
};

export default UserList;