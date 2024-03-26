import React, { useState } from 'react';
import DoctorDetails from './DoctorDetails';

const SearchDoctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [consultants, setConsultants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:27017/api/v1/patient/SearchConsultant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ "specification": selectedOption })
            });

            if (response.ok) {
                const data = await response.json();
                setConsultants(data.consultants);
            } else {
                console.error('Error searching for consultants:', response.statusText);
            }
        } catch (error) {
            console.error('Error searching for consultants:', error);
        }
        setIsLoading(false);
    };

    const handleViewDetails = (doctorId) => {
        console.log(doctorId)
        setSelectedDoctorId(doctorId);
    };

    return (
        <div className="search-container">
            {selectedDoctorId && <DoctorDetails doctorId={selectedDoctorId} />}
            {!selectedDoctorId &&
            <div>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select doctor's specialty</option>
        <option value="General Physician">General Physician</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Ophthalmologist">Ophthalmologist</option>
        <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Gynecologist">Gynecologist</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Psychiatrist">Psychiatrist</option>
        <option value="Endocrinologist">Endocrinologist</option>
        <option value="Gastroenterologist">Gastroenterologist</option>
        <option value="Urologist">Urologist</option>
        <option value="Oncologist">Oncologist</option>
        <option value="ENT Specialist">ENT Specialist</option>
        <option value="Pulmonologist">Pulmonologist</option>
        <option value="Radiologist">Radiologist</option>
        <option value="Nephrologist">Nephrologist</option>
        <option value="Rheumatologist">Rheumatologist</option>
        <option value="Allergist">Allergist</option>
        <option value="Dentist">Dentist</option>
        <option value="Oncologist">Oncologist</option>
        <option value="Ophthalmologist">Ophthalmologist</option>
        <option value="Podiatrist">Podiatrist</option>
        <option value="Psychologist">Psychologist</option>
        <option value="Radiation Oncologist">Radiation Oncologist</option>
        <option value="Pathologist">Pathologist</option>
        <option value="Plastic Surgeon">Plastic Surgeon</option>
        <option value="Pulmonologist">Pulmonologist</option>
        <option value="Rheumatologist">Rheumatologist</option>
        <option value="Sports Medicine Physician">Sports Medicine Physician</option>
        <option value="Surgeon">Surgeon</option>
        <option value="Urologist">Urologist</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      {isLoading && <div>Loading...</div>}
            {!isLoading && consultants.length > 0 && (
                <div className="consultants-list">
                    <h2>Consultants</h2>
                    <ul>
                        {consultants.map((consultant) => (
                            <li key={consultant._id}>
                                <h3>{consultant.name}</h3>
                                <p>Gender: {consultant.gender}</p>
                                <p>Specialization: {consultant.specification}</p>
                                <p>Charge: ${consultant.charge}</p>
                                <p>Available Times: {consultant.availabilityTime.join(', ')}</p>
                                <button onClick={() => handleViewDetails(consultant._id)}>View Details</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
            }
        </div>
    );
};

export default SearchDoctor;
