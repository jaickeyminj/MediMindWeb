import React from 'react';
import './App.css';

import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
