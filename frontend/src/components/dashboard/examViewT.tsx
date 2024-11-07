import React, { useEffect, useState } from 'react';
import './view.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamView: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/exam/my-examsT', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExams(response.data);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };

    fetchExams();
  }, []);

  const editExam = (examID: number) => {
    console.log('Edit exam:', examID);
    navigate(`/edit-exam/${examID}`);
  }

  return (
    <div className='view'>
      <div className='header'>
        <h1>Upcoming Exams</h1>
      </div>
      {exams.length === 0 ? (
        <div>No upcoming exams.</div>
      ) : (
        exams.map((exam, index) => {
          const examDate = new Date(exam.examDate);
          const day = examDate.getDate();
          const month = examDate.toLocaleString('default', { month: 'short' });
          let hours = examDate.getHours();
          let eve = 'AM';
          if (hours > 12) {
            hours = hours - 12;
            eve = 'PM';
          } else if (hours === 0) {
            hours = 12;
          } else if (hours === 12) {
            eve = 'PM';
          }
          return (
            <div key={index} className='exam'>
              <div className='exam-item'>
                <div>
                  {exam.examName} <br />
                  <button className='btn' onClick={() => editExam(exam.examID)}>Edit</button>
                </div>
                <div className='exam-date'>{day} {month}<br />{hours} {eve}</div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default ExamView;