import React, { useState, useEffect } from 'react';

const PreviousPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch token from local storage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchData(storedToken);
    } else {
      // Redirect to login or handle authentication flow
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await fetch('http://localhost:27017/api/v1//patient/getPredictedDiseases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if(data.predictedDiseases!=null)
        setPredictions(data.predictedDiseases); // Assuming the response contains an array of predictions
      } else {
        console.error('Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleUpdateStatus = async (predictedDisease, isCorrect) => {
    try {
      const response = await fetch('http://localhost:27017/api/v1/patient/updatePredictionStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ "predictedDisease": predictedDisease, "isCorrect": true })
      });

      if (response.ok) {
        // Update predictions state after successful status update
        setPredictions(prevPredictions => prevPredictions.filter(prediction => prediction.predictedDisease !== predictedDisease));
        alert("thank you for your feedback")
      } else {
        console.error('Failed to update prediction status');
      }
    } catch (error) {
      console.error('Error updating prediction status:', error);
    }
  };

  return (
    <div className="container3">
      <h2>Previous Predictions</h2>
      <p>Please give your feedback about the predictions</p>
      <div>
        {predictions.map(prediction => (
          <div key={prediction.predictedDisease} className='appointment-card'>
            <p>{prediction.predictedDisease}</p>
            <button onClick={() => handleUpdateStatus(prediction.predictedDisease, true)}>👍</button>
            <button onClick={() => handleUpdateStatus(prediction.predictedDisease, false)}>👎</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousPredictions;
