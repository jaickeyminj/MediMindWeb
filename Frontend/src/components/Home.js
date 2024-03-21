import React from 'react';
import Navbar from './Navbar';
import TypingEffect from './TypingEffect';
const Home = () => {
  const phrases = ["Revolutionizing Medical Consultancy", "Stay Informed, Stay Healthy", "Your Well-being is Our Priority"];
  return (
    <div>
      <Navbar />
      <div className='home'>
      <h2>Welcome to Medimind</h2>
      <TypingEffect phrases={phrases} />
      </div>
    </div>
  );
}

export default Home;
