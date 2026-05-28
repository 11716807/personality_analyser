import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Sidepanel from '../Sidepanel/Sidepanel';
import { AuthProvider } from '../Auth/AuthContext';
import '../../assets/styles/global.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.esm.min.js';
const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(
  <AuthProvider>
    <Sidepanel />
  </AuthProvider>
);
