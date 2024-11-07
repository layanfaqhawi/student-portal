import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './attemptExam.css';

interface Answer {
  answerID: number;
  answerText: string;
}

interface Question {
  questionID: number;
  questionText: string;
  answers: Answer[];
}

interface Exam {
  examID: number;
  examName: string;
  questions: Question[];
}

const AttemptExam: React.FC = () => {
  const { sessionID } = useParams<{sessionID: string}>();
  const { examID } = useParams<{ examID: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionID: number]: number | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        console.log('sessionID:', sessionID);
        console.log('Fetching exam:', examID);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/exam/${examID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExam(response.data);
      } catch (err) {
        console.error('Error fetching exam:', err);
      }
    };

    fetchExam();
  }, [examID]);

  const handleAnswerChange = (questionID: number, answerID: number) => {
    setAnswers({ ...answers, [questionID]: answerID });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit the answers
      const submitAnswers = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post(`http://localhost:3000/session/end/${sessionID}`);
          await axios.post(`http://localhost:3000/exam/${sessionID}/submit`, { answers }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          navigate('/student-dashboard'); // Redirect to dashboard after submission
        } catch (err) {
          console.error('Error submitting answers:', err);
        }
      };
      submitAnswers();
    }
  };

  if (!exam) {
    return <div>Loading...</div>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="exam-taking">
      <h1>{exam.examName}</h1>
      <div className="question">
        <h2>Question {currentQuestionIndex+1}: {currentQuestion.questionText}</h2>
        {currentQuestion.answers.map(answer => (
          <div key={answer.answerID}>
            <p className='ans'>{answer.answerText}</p>
            <input
              type="radio"
              name={`question-${currentQuestion.questionID}`}
              value={answer.answerID}
              checked={answers[currentQuestion.questionID] === answer.answerID}
              onChange={() => handleAnswerChange(currentQuestion.questionID, answer.answerID)}
            />
          </div>
        ))}
      </div>
      <button onClick={handleNextQuestion}>
        {currentQuestionIndex < (exam.questions.length ?? 0) - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
};

export default AttemptExam;