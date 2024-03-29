import React, { useState } from 'react';

const SymptomInput = ({ selectedSymptoms = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (symptom) => {
    const updatedSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((s) => s !== symptom)
      : [...selectedSymptoms, symptom];
    onChange(updatedSymptoms);
  };

  // Sample dataset columns (symptoms)
  const dataset_columns = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
    // Add other symptoms here...
  ];

  return (
    <div className="symptom-input">
      <div className="selected-symptoms">
        {selectedSymptoms && selectedSymptoms.map((symptom) => (
          <div key={symptom} className="selected-symptom">
            {symptom}
            <button onClick={() => handleCheckboxChange(symptom)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown}>Select Symptoms</button>
        {isOpen && (
          <div className="options">
            {dataset_columns.map((symptom) => (
              <label key={symptom}>
                <input
                  type="checkbox"
                  value={symptom}
                  checked={selectedSymptoms && selectedSymptoms.includes(symptom)}
                  /*onChange={() => handleCheckboxChange(symptom)}*/
                />
                {symptom}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomInput;
