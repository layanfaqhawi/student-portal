import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './studentGrades.css';

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/grade/released', {
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

  return (
    <div className="grades">
      <h1>Your Grades</h1>
      <table>
        <thead>
          <tr>
            <th>Exam</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.exam ? grade.exam.examName : 'Unknown Exam'}</td>
              <td>{grade.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;