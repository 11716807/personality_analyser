import React from "react";
import logo from '../../assets/img/logo';
import styles from "./RotatingLogo.module.css"; // Import CSS module

const RotatingLogo = () => {
  return (
    <div className={styles.logoContainer}>
      <img src={logo} alt="Logo" width={100} className={styles.rotatingLogo} />
    </div>
  );
};

export default RotatingLogo;
