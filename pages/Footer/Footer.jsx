import React from 'react';
import logo from '../../assets/img/logo';
import './Footer.css';

const Footer = () => {
  return (
    <section className="text-black" id="Footer">
      <div className="container text-center p-1">
        <img src={logo} alt="PsyGenie" width="15px" />
        <span className="fs-14 text-muted">&nbsp;PsyGenie</span>
        <span className="fs-14 text-muted"> Copyright &copy; 2025.</span>
      </div>
    </section>
  );
};

export default Footer;
