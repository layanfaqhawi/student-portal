import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './schedule.css';

const Schedule: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);  

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/course/my-courses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className='schedule'>
        <h1>Schedule</h1>
        <div className='schedule-content'>
            <div className='schedule-item'>
                <div>Course ID</div>
                <div>Course Name</div>
                <div>Section</div>
                <div>Days</div>
                <div>Time</div>
            </div>
        </div>
    </div>
    );
};

export default Schedule;
