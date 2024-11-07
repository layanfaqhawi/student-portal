import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './studentGrades.css';

const StudentGrades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/grade/studentGrades', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGrades(response.data);
      } catch (err) {
        console.error('Error fetching grades:', err);
      }
    };

    fetchGrades();
  }, []);

  const releaseGrade = async (gradeID: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/grade/release/${gradeID}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update the grade list after releasing a grade
      setGrades(grades.map(grade => grade.gradeID === gradeID ? { ...grade, released: true } : grade));
    } catch (err) {
      console.error('Error releasing grade:', err);
    }
  };

  return (
    <div className="grades">
      <h1>All Grades</h1>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Exam/Assignment</th>
            <th>Type</th>
            <th>Grade</th>
            <th>Released</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{`${grade.student.user.firstName} ${grade.student.user.lastName}`}</td>
              <td>{grade.exam ? grade.exam.examName : grade.assignment.assignmentName}</td>
              <td>{grade.type}</td>
              <td>{grade.grade}</td>
              <td>{grade.released ? 'Yes' : 'No'}</td>
              <td>
                {!grade.released && (
                  <button onClick={() => releaseGrade(grade.gradeID)}>Release</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;
