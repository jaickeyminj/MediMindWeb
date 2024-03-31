import React from 'react';
import './App.css';

import Home from './components/Home';
import PatientDashboard from './components/PatientDashboard';
import UserLoginOffcanvas from './components/UserLoginOffcanvas';
import ConsultantLoginOffcanvas from './components/ConsultantLoginOffcanvas';
import { Routes, Route } from 'react-router-dom';
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/patient' element={<UserLoginOffcanvas />} />
        <Route path='/consultant' element={<ConsultantLoginOffcanvas />} />
        <Route path='/patientdashboard' element={<PatientDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
