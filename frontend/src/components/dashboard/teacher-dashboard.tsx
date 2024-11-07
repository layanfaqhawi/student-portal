// src/components/dashboard/teacherDashboard.tsx
import React from 'react';
import Teaching from './teachings';
import AddExam from './addExam';
import ExamView from './examViewT';
import StudentGrades from './studentGrades';
import SidebarTeacher from './navigation/sidebarTeacher';
import { useState } from 'react';

const TeacherDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'exams':
        return <ExamView />;
      case 'addExam':
        return <AddExam />;
      case 'grades':
        return <StudentGrades />;
      case 'teach':
        return <Teaching />
      case 'logout':
        localStorage.removeItem('token');
        window.location.href = '/';
        return null;
      case 'home':
      default:
        return null;
    }
  };
  

  return (
    <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
      <SidebarTeacher isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onSelectView={setCurrentView}/>
    <div className='contain'>
      {renderView()}
    </div>
    </div>
  );
};

export default TeacherDashboard;
