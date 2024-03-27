import React from 'react';
import './App.css';

import Home from './components/Home';
import PatientDashboard from './components/PatientDashboard';
import { Routes, Route } from 'react-router-dom';
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/patientdashboard' element={<PatientDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
