import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sections.css';

const Sections: React.FC = () => {
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get('http://localhost:3000/section');
                setSections(response.data);
            } catch (err) {
                console.error('Error fetching sections:', err);
            }
        };

        fetchSections();
    }, []);

    const handleRegister = async (sectionID: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/section/register/${sectionID}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Register response:', response.data);
            alert(response.data);
        } catch (err) {
            console.error('Error registering for section:', err);
            alert('Failed to register for section');
        }
    };

    return (
        <div className='sections'>
            <div className='header'>
                <div>Course ID</div>
                <div>Course Name</div>
                <div>Sections</div>
                <div>Days</div>
                <div>Register</div>
            </div>
            {sections.length === 0 ? (
                <div>No courses available.</div>
            ) : (
                sections.map((section, index) => (
                    <div key={index} className='section-item'>
                        <div>{section.courseID}</div>
                        <div>{section.course.courseName}</div>
                        <div>{section.sectionName}</div>
                        <div>{section.days}</div>
                        <button onClick={() => handleRegister(section.sectionID)}>Add Course</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Sections;