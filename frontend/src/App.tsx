import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './components/auth/register';
import Login from './components/auth/login';
import StudentDashboard from './components/dashboard/student-dashboard';
import TeacherDashboard from './components/dashboard/teacher-dashboard';
import ToggleSwitch from './components/other/toggleSwitch';
import EditExam from './components/dashboard/edit-exam';
import AttemptExam from './components/dashboard/attemptExam';
import StudentGrades from './components/dashboard/studentGrades';
import Grades from './components/dashboard/grades';
import ExamView from './components/dashboard/examView';
import './App.css';
const App: React.FC = () => {

  return (
  <>
    <Router>
      <nav>
        <ToggleSwitch />
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/edit-exam/:examID" element={<EditExam />} />
        <Route path="/attempt-exam/:examID/:sessionID" element={<AttemptExam />} />
        <Route path="/studentGrades" element={<StudentGrades />} />
        <Route path="/exams" element={<ExamView />} />
        <Route path="/grades" element={<Grades />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;

