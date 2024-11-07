import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './teachings.css';

const Teachings: React.FC = () => {
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

    const handleTeach = async (sectionID: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/section/teach/${sectionID}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Successfully registered for teaching section');
        } catch (err) {
            console.error('Error registering for teaching section:', err);
            alert('Failed to register for teaching section');
        }
    };

    return (
        <div className='sections'>
            <div className='header'>
                <div>Course ID</div>
                <div>Course Name</div>
                <div>Sections</div>
                <div>Days</div>
                <div>Teach</div>
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
                        <button onClick={() => handleTeach(section.sectionID)}>Add Course</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Teachings;
