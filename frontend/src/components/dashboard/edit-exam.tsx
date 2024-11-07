import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './editExam.css';

const EditExam: React.FC = () => {
  const { examID } = useParams<{ examID: string }>();
  const [exam, setExam] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [suggestedQuestions, setSuggestedQuestions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/exam/edit/${examID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExam(response.data);
        setQuestions(response.data.questions || []);
      } catch (err) {
        console.error('Error fetching exam:', err);
      }
    };

    fetchExam();
  }, [examID]);

  useEffect(() => {
    if (newQuestion.length > 2) {
      const searchQuestions = async () => {
        try {
          const token = localStorage.getItem('token');
          const query = newQuestion.toLowerCase();
          const response = await axios.get(`http://localhost:3000/exam/search-questions/${examID}/${query}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSuggestedQuestions(response.data);
        } catch (err) {
          console.error('Error searching questions:', err);
        }
      };
      searchQuestions();
    } else {
      setSuggestedQuestions([]);
    }
  }, [newQuestion, examID]);

  const handleExamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion(e.target.value);
  };

  const handleAnswerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswersCopy = [...newAnswers];
    newAnswersCopy[index] = e.target.value;
    setNewAnswers(newAnswersCopy);
  };

  const addQuestion = () => {
    const question = {
      questionText: newQuestion, // Corrected property name
      answers: newAnswers.map((answer, index) => ({
        answerText: answer, // Corrected property name
        isCorrect: index === correctAnswerIndex
      }))
    };
    setQuestions([...questions, question]);
    setNewQuestion('');
    setNewAnswers(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };

  const selectSuggestedQuestion = (question: any) => {
    setNewQuestion(question.questionText);
    const answers = (question.answers || []).map((answer: any) => answer.answerText);
    setNewAnswers(answers.concat(Array(4 - answers.length).fill(''))); // Ensure there are always 4 answer fields
    setCorrectAnswerIndex((question.answers || []).findIndex((answer: any) => answer.isCorrect));
    setSuggestedQuestions([]);
  };

  const saveExam = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Exam:', exam);
      console.log('Questions:', questions);
      const response = await axios.patch(`http://localhost:3000/exam/edit/${examID}`, { ...exam, questions }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.error) {
        console.error('Error updating exam:', response.data.error);
        alert('Error updating exam:' + response.data.error);
        return;
      }
      console.log('Exam updated successfully');
      navigate('/teacher-dashboard');
    } catch (err) {
      console.error('Error updating exam:', err);
    }
  };

  const handleEditQuestion = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleEditAnswer = (qIndex: number, aIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[aIndex].answerText = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, aIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.map((answer: any, index: number) => ({
      ...answer,
      isCorrect: index === aIndex
    }));
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <div className='editView'>
        <div className='editHeader'>
          <input
            className='exam'
            type="text"
            name="examName"
            value={exam.examName || ''}
            onChange={handleExamChange}
            placeholder="Exam Name"
          />
          <input
            className='exam'
            type="datetime-local"
            name="examDate"
            value={exam.examDate || ''}
            onChange={handleExamChange}
          />
          <button onClick={saveExam}>Save Exam</button>
        </div>
        <div className='questions'>
          <h2>Questions</h2>
          {questions.map((question, qIndex) => (
            <div key={qIndex}>
              <h3>
                Question {qIndex + 1}: <br />
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleEditQuestion(qIndex, e)}
                />
                <button onClick={() => deleteQuestion(qIndex)}>Delete</button>
              </h3>
              {question.answers.map((answer: any, aIndex: number) => (
                <div className='answers' key={aIndex}>
                  <div className='ans'>
                    <input
                      type="text"
                      value={answer.answerText}
                      onChange={(e) => handleEditAnswer(qIndex, aIndex, e)}
                    />
                    <input
                      className='radio'
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className='new-question'>
            <input
              type="text"
              value={newQuestion}
              onChange={handleQuestionChange}
              placeholder="New Question"
            />
            {suggestedQuestions.length > 0 && (
              <div className='suggestions'>
                <select onChange={(e) => selectSuggestedQuestion(suggestedQuestions[parseInt(e.target.value, 10)])}>
                  <option value="">Select a suggested question</option>
                  {suggestedQuestions.map((question, index) => (
                    <option key={index} value={index}>{question.questionText}</option>
                  ))}
                </select>
              </div>
            )}
            <br /><br />
            {newAnswers.map((answer, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e)}
                  placeholder={`Answer ${index + 1}`}
                />
                <input
                  type="radio"
                  className='radio'
                  name="correctAnswer"
                  checked={correctAnswerIndex === index}
                  onChange={() => setCorrectAnswerIndex(index)}
                /><br /><br />
              </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExam;
