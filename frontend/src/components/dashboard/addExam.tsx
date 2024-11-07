import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddExam: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({ courseID: '', examName: '', examDate: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/teaching/my-courses', {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, courseID: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/exam', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select name="courseID" value={formData.courseID} onChange={handleSelectChange}>
          <option value="" disabled>Select a course</option>
          {courses.map((course) => (
            <option key={course.courseID} value={course.courseID}>
              {course.courseName}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Exam Name" name="examName" value={formData.examName} onChange={handleChange} />
        <input type="datetime-local" name="examDate" value={formData.examDate} onChange={handleChange} />
        <button type="submit">Add Exam</button>
      </form>
    </div>
  );
};

export default AddExam;