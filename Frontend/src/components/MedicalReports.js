import React, { useState, useEffect } from 'react';

const MedicalReports = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [reportLinks, setReportLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:27017/api/v1/getAllReportIds', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReportLinks(data.reportLinks);
                } else {
                    console.error('Error fetching reports:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
            setIsLoading(false);
        };

        fetchReports();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await fetch('http://localhost:27017/api/v1/UploadReports', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                console.log('Report uploaded successfully!');
                // Refresh reports or update state as needed
            } else {
                console.error('Error uploading report:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading report:', error);
        }
    };

    return (
        <div className="report-upload">
            <h2>Report Upload</h2>
            <input
                className='fileselector'
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload Report</button>

            <h2>All Reports</h2>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <ul className='container3'>
                    {reportLinks.map((reportLink, index) => (
                        <li key={index}><a href={reportLink} target="_blank" rel="noopener noreferrer">Report {index + 1}</a></li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MedicalReports;
