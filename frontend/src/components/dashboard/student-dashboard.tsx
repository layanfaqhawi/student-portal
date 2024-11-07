import React, { useEffect, useState } from 'react';
import ExamView from './examView'; // Corrected import statement
import Sections from './sections';
import Grades from './grades';
import './studentDash.css';
import axios from 'axios';
import SidebarStudent from './navigation/sidebarStudent'; // Corrected import statement
import Schedule from './schedule';

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'exams':
        return <ExamView />;
      case 'sections':
        return <Sections />;
      case 'grades':
        return <Grades />;
      case 'register':
        return <Sections />;
      case 'logout':
        localStorage.removeItem('token');
        window.location.href = '/';
        return null;
      case 'home':
      default:
        return null;
    }
  };
  
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
    <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
      <SidebarStudent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onSelectView={setCurrentView}/>
    <div className='contain'>
      <h1>My Courses</h1>
      <div className='courses'>
        {courses.length === 0 ? (
          <div>No courses available.</div>
        ) : (
          courses.map((course, index) => (
            <div key={index} className='course'>
              <div className='course-item'>
                {course.courseName}
              </div>
            </div>
          ))
        )}
      </div>
      {renderView()}
      </div>
    </div>
  );
};

export default StudentDashboard;
