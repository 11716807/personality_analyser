import React, { useEffect, useState } from 'react';
import { Alert } from "react-bootstrap";
import "./NotificationBar.css";


const NotificationBar = ({ message, link }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert
      variant="dark"
      className="notification-bar d-flex align-items-center justify-content-between"
      onClick={() => window.open(link, "_blank")}
    >
      <span>{message}</span>
      <button
        className="btn-close"
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
      ></button>
    </Alert>
  );
};

export default NotificationBar;
