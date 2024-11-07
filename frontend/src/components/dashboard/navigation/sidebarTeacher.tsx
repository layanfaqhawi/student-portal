import React from 'react';
import './sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    onSelectView: (view: string) => void;
  }

const SidebarTeacher: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onSelectView }) => {
  return (
    <>
    <div className={`sidebar-handle ${isOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}></div>
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className='one'>
            <h3>Portal</h3>
        </div>
        <div className='two'>
            <h3>Academic</h3>
            <h4>Assignments</h4>
            <h4 onClick={() => onSelectView('exams')}>Exams</h4>
            <h4 onClick={() => onSelectView('grades')}>Grades</h4>
        </div>
        <div className='three'>
            <h3>Administrative</h3>
            <h4 onClick={() => onSelectView('teach')}>Teach Section</h4>
            <h4 onClick={() => onSelectView('addExam')}>Add Exam</h4>
        </div>
        <div className='five'>
            <h3>Logout</h3>
        </div>
    </div>
    </>
  );
};

export default SidebarTeacher;
