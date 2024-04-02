import React, { useState } from 'react';

const UpdateDetails = () => {
    const [formData, setFormData] = useState({
        password: '',
        mobileNo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const patientId = localStorage.getItem('_id');
            const requestData = {
                patientId: patientId,
                updates: formData
            };
            console.log(requestData)
            const response = await fetch('http://localhost:27017/api/v1/patient/updatePatientData', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Details updated successfully:');
                // Handle success, e.g., show a success message or redirect
            } else {
                console.error('Error updating details:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating details:', error);
        }
    };

    return (
        <div className="update-details">
            <h2>Update Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    
                    <input
                        type="Password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder='Password'
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    
                    <input
                        type="text"
                        id="mobileNo"
                        name="mobileNo"
                        value={formData.mobileNo}
                        placeholder='Mobile no'
                        onChange={handleChange}
                    />
                </div>
                
                <button type="submit">Update Details</button>
            </form>
        </div>
    );
};

export default UpdateDetails;
